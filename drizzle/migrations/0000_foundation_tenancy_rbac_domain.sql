
create type public.app_role as enum ('super_admin');
create type public.org_role as enum ('org_admin','esg_manager','data_contributor','auditor');
create type public.emission_scope as enum ('scope_1','scope_2','scope_3');
create type public.record_status as enum ('draft','submitted','approved','rejected');
create type public.period_status as enum ('open','locked','closed');

create table public.profiles (
  id uuid primary key,
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function public.is_super_admin(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(_user_id, 'super_admin')
$$;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  industry text,
  country text,
  base_currency text not null default 'USD',
  fiscal_year_start_month int not null default 1,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.organizations to authenticated;
grant all on public.organizations to service_role;
alter table public.organizations enable row level security;

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null,
  role public.org_role not null,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);
create index on public.organization_members(user_id);
grant select, insert, update, delete on public.organization_members to authenticated;
grant all on public.organization_members to service_role;
alter table public.organization_members enable row level security;

create or replace function public.is_org_member(_user_id uuid, _org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_super_admin(_user_id) or exists (
    select 1 from public.organization_members where user_id = _user_id and organization_id = _org)
$$;
create or replace function public.has_org_role(_user_id uuid, _org uuid, _roles public.org_role[])
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_super_admin(_user_id) or exists (
    select 1 from public.organization_members
    where user_id = _user_id and organization_id = _org and role = any(_roles))
$$;

create table public.facilities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text,
  facility_type text not null default 'office',
  country text,
  city text,
  floor_area_m2 numeric,
  headcount int,
  within_boundary boolean not null default true,
  ownership_share numeric not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.facilities(organization_id);
grant select, insert, update, delete on public.facilities to authenticated;
grant all on public.facilities to service_role;
alter table public.facilities enable row level security;

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  facility_id uuid references public.facilities(id) on delete set null,
  name text not null,
  cost_center text,
  created_at timestamptz not null default now()
);
create index on public.departments(organization_id);
grant select, insert, update, delete on public.departments to authenticated;
grant all on public.departments to service_role;
alter table public.departments enable row level security;

create table public.reporting_periods (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  is_baseline boolean not null default false,
  status public.period_status not null default 'open',
  consolidation_approach text not null default 'operational_control',
  created_at timestamptz not null default now(),
  check (end_date > start_date)
);
create index on public.reporting_periods(organization_id);
grant select, insert, update, delete on public.reporting_periods to authenticated;
grant all on public.reporting_periods to service_role;
alter table public.reporting_periods enable row level security;

create table public.activity_categories (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  scope public.emission_scope not null,
  ghg_category text,
  default_unit text not null,
  description text
);
grant select on public.activity_categories to authenticated;
grant all on public.activity_categories to service_role;
alter table public.activity_categories enable row level security;

create table public.emission_factors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  category_id uuid not null references public.activity_categories(id),
  name text not null,
  region text not null default 'GLOBAL',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.emission_factors to authenticated;
grant all on public.emission_factors to service_role;
alter table public.emission_factors enable row level security;

create table public.emission_factor_versions (
  id uuid primary key default gen_random_uuid(),
  emission_factor_id uuid not null references public.emission_factors(id) on delete cascade,
  version int not null default 1,
  value numeric not null,
  unit text not null,
  co2e_unit text not null default 'kgCO2e',
  source text not null,
  source_year int,
  valid_from date not null,
  valid_to date,
  created_at timestamptz not null default now(),
  unique (emission_factor_id, version)
);
grant select, insert, update, delete on public.emission_factor_versions to authenticated;
grant all on public.emission_factor_versions to service_role;
alter table public.emission_factor_versions enable row level security;

create table public.activity_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  facility_id uuid references public.facilities(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  reporting_period_id uuid references public.reporting_periods(id) on delete set null,
  category_id uuid not null references public.activity_categories(id),
  activity_date date not null,
  quantity numeric not null,
  unit text not null,
  notes text,
  status public.record_status not null default 'draft',
  submitted_by uuid,
  approved_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.activity_records(organization_id, activity_date);
grant select, insert, update, delete on public.activity_records to authenticated;
grant all on public.activity_records to service_role;
alter table public.activity_records enable row level security;

create table public.emission_calculations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  activity_record_id uuid not null references public.activity_records(id) on delete cascade,
  emission_factor_version_id uuid not null references public.emission_factor_versions(id),
  scope public.emission_scope not null,
  normalized_quantity numeric not null,
  co2e_kg numeric not null,
  formula text not null,
  engine_version text not null default '1.0.0',
  calculated_at timestamptz not null default now()
);
create index on public.emission_calculations(organization_id);
grant select, insert, update, delete on public.emission_calculations to authenticated;
grant all on public.emission_calculations to service_role;
alter table public.emission_calculations enable row level security;

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  actor_id uuid,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);
create index on public.audit_logs(organization_id, created_at desc);
grant select on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;

create policy "own profile read" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_super_admin(auth.uid()) or exists (
    select 1 from public.organization_members a join public.organization_members b
      on a.organization_id = b.organization_id where a.user_id = auth.uid() and b.user_id = profiles.id));
create policy "own profile write" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid());

create policy "read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.is_super_admin(auth.uid()));

create policy "members read org" on public.organizations for select to authenticated
  using (public.is_org_member(auth.uid(), id));
create policy "admins update org" on public.organizations for update to authenticated
  using (public.has_org_role(auth.uid(), id, array['org_admin']::public.org_role[]));
create policy "super admin delete org" on public.organizations for delete to authenticated
  using (public.is_super_admin(auth.uid()));

create policy "members read members" on public.organization_members for select to authenticated
  using (public.is_org_member(auth.uid(), organization_id));
create policy "admins manage members" on public.organization_members for all to authenticated
  using (public.has_org_role(auth.uid(), organization_id, array['org_admin']::public.org_role[]))
  with check (public.has_org_role(auth.uid(), organization_id, array['org_admin']::public.org_role[]));

do $$ declare t text; begin
  foreach t in array array['facilities','departments','reporting_periods'] loop
    execute format('create policy "members read" on public.%I for select to authenticated using (public.is_org_member(auth.uid(), organization_id))', t);
    execute format('create policy "managers write" on public.%I for all to authenticated using (public.has_org_role(auth.uid(), organization_id, array[''org_admin'',''esg_manager'']::public.org_role[])) with check (public.has_org_role(auth.uid(), organization_id, array[''org_admin'',''esg_manager'']::public.org_role[]))', t);
  end loop; end $$;

create policy "all read categories" on public.activity_categories for select to authenticated using (true);

create policy "read factors" on public.emission_factors for select to authenticated
  using (organization_id is null or public.is_org_member(auth.uid(), organization_id));
create policy "manage org factors" on public.emission_factors for all to authenticated
  using ((organization_id is null and public.is_super_admin(auth.uid())) or (organization_id is not null and public.has_org_role(auth.uid(), organization_id, array['org_admin','esg_manager']::public.org_role[])))
  with check ((organization_id is null and public.is_super_admin(auth.uid())) or (organization_id is not null and public.has_org_role(auth.uid(), organization_id, array['org_admin','esg_manager']::public.org_role[])));

create policy "read factor versions" on public.emission_factor_versions for select to authenticated
  using (exists (select 1 from public.emission_factors f where f.id = emission_factor_id
    and (f.organization_id is null or public.is_org_member(auth.uid(), f.organization_id))));
create policy "manage factor versions" on public.emission_factor_versions for all to authenticated
  using (exists (select 1 from public.emission_factors f where f.id = emission_factor_id
    and ((f.organization_id is null and public.is_super_admin(auth.uid())) or (f.organization_id is not null and public.has_org_role(auth.uid(), f.organization_id, array['org_admin','esg_manager']::public.org_role[])))))
  with check (exists (select 1 from public.emission_factors f where f.id = emission_factor_id
    and ((f.organization_id is null and public.is_super_admin(auth.uid())) or (f.organization_id is not null and public.has_org_role(auth.uid(), f.organization_id, array['org_admin','esg_manager']::public.org_role[])))));

create policy "members read activity" on public.activity_records for select to authenticated
  using (public.is_org_member(auth.uid(), organization_id));
create policy "contributors insert activity" on public.activity_records for insert to authenticated
  with check (public.has_org_role(auth.uid(), organization_id, array['org_admin','esg_manager','data_contributor']::public.org_role[]));
create policy "contributors update activity" on public.activity_records for update to authenticated
  using (public.has_org_role(auth.uid(), organization_id, array['org_admin','esg_manager']::public.org_role[])
    or (submitted_by = auth.uid() and status in ('draft','rejected') and public.has_org_role(auth.uid(), organization_id, array['data_contributor']::public.org_role[])));
create policy "managers delete activity" on public.activity_records for delete to authenticated
  using (public.has_org_role(auth.uid(), organization_id, array['org_admin','esg_manager']::public.org_role[]));

create policy "members read calcs" on public.emission_calculations for select to authenticated
  using (public.is_org_member(auth.uid(), organization_id));
create policy "managers write calcs" on public.emission_calculations for all to authenticated
  using (public.has_org_role(auth.uid(), organization_id, array['org_admin','esg_manager']::public.org_role[]))
  with check (public.has_org_role(auth.uid(), organization_id, array['org_admin','esg_manager']::public.org_role[]));

create policy "admins auditors read audit" on public.audit_logs for select to authenticated
  using (public.has_org_role(auth.uid(), organization_id, array['org_admin','esg_manager','auditor']::public.org_role[]));

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), new.email);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.audit_trigger() returns trigger
language plpgsql security definer set search_path = public as $$
declare org uuid; rid uuid;
begin
  if tg_op = 'DELETE' then
    org := old.organization_id; rid := old.id;
  else
    org := new.organization_id; rid := new.id;
  end if;
  insert into public.audit_logs (organization_id, actor_id, action, entity_type, entity_id, before_data, after_data)
  values (org, auth.uid(), lower(tg_op), tg_table_name, rid,
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end);
  return coalesce(new, old);
end $$;

do $$ declare t text; begin
  foreach t in array array['facilities','departments','reporting_periods','organization_members','activity_records'] loop
    execute format('create trigger audit_%1$s after insert or update or delete on public.%1$I for each row execute function public.audit_trigger()', t);
  end loop; end $$;

create or replace function public.create_organization(_name text, _industry text, _country text)
returns uuid language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  insert into public.organizations (name, industry, country, created_by, slug)
  values (_name, _industry, _country, auth.uid(),
    lower(regexp_replace(_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(gen_random_uuid()::text,1,6))
  returning id into new_id;
  insert into public.organization_members (organization_id, user_id, role) values (new_id, auth.uid(), 'org_admin');
  insert into public.reporting_periods (organization_id, name, start_date, end_date, is_baseline)
  values (new_id, 'FY ' || extract(year from now())::int, make_date(extract(year from now())::int,1,1), make_date(extract(year from now())::int,12,31), true);
  insert into public.audit_logs (organization_id, actor_id, action, entity_type, entity_id)
  values (new_id, auth.uid(), 'insert', 'organizations', new_id);
  return new_id;
end $$;
revoke execute on function public.create_organization(text,text,text) from anon, public;
grant execute on function public.create_organization(text,text,text) to authenticated;

insert into public.activity_categories (code, name, scope, ghg_category, default_unit, description) values
 ('stationary_natural_gas','Natural gas (stationary)','scope_1','Stationary combustion','kWh','Boilers, heaters, furnaces'),
 ('stationary_diesel','Diesel (generators)','scope_1','Stationary combustion','litre','Backup generators'),
 ('mobile_petrol','Company vehicles – petrol','scope_1','Mobile combustion','litre','Owned or leased fleet'),
 ('mobile_diesel','Company vehicles – diesel','scope_1','Mobile combustion','litre','Owned or leased fleet'),
 ('refrigerant_r410a','Refrigerant leakage – R410A','scope_1','Fugitive emissions','kg','HVAC top-ups'),
 ('electricity_grid','Purchased electricity (grid)','scope_2','Purchased electricity','kWh','Location-based'),
 ('district_heat','Purchased heat / steam','scope_2','Purchased heat','kWh','District heating'),
 ('travel_air_short','Business travel – short-haul flight','scope_3','Cat. 6 Business travel','passenger_km','< 3,700 km'),
 ('travel_air_long','Business travel – long-haul flight','scope_3','Cat. 6 Business travel','passenger_km','> 3,700 km'),
 ('travel_hotel','Business travel – hotel nights','scope_3','Cat. 6 Business travel','room_night',null),
 ('commute_car','Employee commuting – car','scope_3','Cat. 7 Employee commuting','km',null),
 ('waste_landfill','Waste – landfill','scope_3','Cat. 5 Waste','tonne',null),
 ('waste_recycled','Waste – recycled','scope_3','Cat. 5 Waste','tonne',null),
 ('water_supply','Water supply','scope_3','Cat. 1 Purchased goods','m3',null),
 ('freight_road','Upstream freight – road','scope_3','Cat. 4 Transportation','tonne_km',null);

with f as (
  insert into public.emission_factors (category_id, name, region)
  select id, name, 'GLOBAL' from public.activity_categories returning id, category_id
)
insert into public.emission_factor_versions (emission_factor_id, version, value, unit, source, source_year, valid_from)
select f.id, 1, v.val, c.default_unit, 'DEFRA/DESNZ GHG Conversion Factors (reference)', 2024, '2024-01-01'
from f join public.activity_categories c on c.id = f.category_id
join (values
 ('stationary_natural_gas',0.18290),('stationary_diesel',2.66155),('mobile_petrol',2.33969),('mobile_diesel',2.51279),
 ('refrigerant_r410a',2088),('electricity_grid',0.20705),('district_heat',0.17880),('travel_air_short',0.15102),
 ('travel_air_long',0.19309),('travel_hotel',10.4),('commute_car',0.16844),('waste_landfill',497.04),
 ('waste_recycled',21.29),('water_supply',0.1913),('freight_road',0.10721)
) as v(code,val) on v.code = c.code;
