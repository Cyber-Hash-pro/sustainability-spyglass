CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  org_name text;
  org_industry text;
  org_country text;
  new_org_id uuid;
  fiscal_year integer;
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.email
  );

  org_name := nullif(trim(new.raw_user_meta_data->>'organization_name'), '');
  org_industry := nullif(trim(new.raw_user_meta_data->>'organization_industry'), '');
  org_country := nullif(trim(new.raw_user_meta_data->>'organization_country'), '');

  if org_name is not null and org_industry is not null and org_country is not null then
    insert into public.organizations (name, industry, country, created_by, slug)
    values (
      org_name,
      org_industry,
      org_country,
      new.id,
      lower(regexp_replace(org_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(gen_random_uuid()::text, 1, 6)
    )
    returning id into new_org_id;

    insert into public.organization_members (organization_id, user_id, role)
    values (new_org_id, new.id, 'org_admin');

    fiscal_year := extract(year from now())::integer;
    insert into public.reporting_periods (organization_id, name, start_date, end_date, is_baseline)
    values (
      new_org_id,
      'FY ' || fiscal_year::text,
      make_date(fiscal_year, 1, 1),
      make_date(fiscal_year, 12, 31),
      true
    );

    insert into public.audit_logs (organization_id, actor_id, action, entity_type, entity_id)
    values (new_org_id, new.id, 'insert', 'organizations', new_org_id);
  end if;

  return new;
end
$function$;