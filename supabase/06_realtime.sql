-- Enable Realtime for branch-scoped inventory, stock logs and branch management.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'branches'
  ) then
    alter publication supabase_realtime add table public.branches;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'branch_inventory'
  ) then
    alter publication supabase_realtime add table public.branch_inventory;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'stock_logs'
  ) then
    alter publication supabase_realtime add table public.stock_logs;
  end if;
end;
$$;
