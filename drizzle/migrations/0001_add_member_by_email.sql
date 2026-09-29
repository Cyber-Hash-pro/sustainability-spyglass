
create or replace function public.add_member_by_email(_org uuid, _email text, _role public.org_role)
returns uuid language plpgsql security definer set search_path = public as $$
declare uid uuid; mid uuid;
begin
  if not public.has_org_role(auth.uid(), _org, array['org_admin']::public.org_role[]) then
    raise exception 'Only organization admins can add members';
  end if;
  select id into uid from public.profiles where lower(email) = lower(trim(_email)) limit 1;
  if uid is null then raise exception 'No registered user with that email. Ask them to create an account first.'; end if;
  insert into public.organization_members (organization_id, user_id, role) values (_org, uid, _role)
  on conflict (organization_id, user_id) do update set role = excluded.role
  returning id into mid;
  return mid;
end $$;
revoke execute on function public.add_member_by_email(uuid,text,public.org_role) from anon, public;
grant execute on function public.add_member_by_email(uuid,text,public.org_role) to authenticated;
