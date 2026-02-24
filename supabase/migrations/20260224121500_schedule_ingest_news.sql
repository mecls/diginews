-- Enable extensions used for scheduling edge functions
create extension if not exists pg_net;
create extension if not exists pg_cron;

-- NOTE:
-- This migration sets up the *pattern* for scheduling. The actual secrets
-- (project URL, publishable key, and ingest secret) must be created in Vault
-- on the target Supabase project, since we should not commit them.
--
-- Required Vault secrets:
-- - project_url: https://<project-ref>.supabase.co
-- - publishable_key: sb_publishable_...
-- - ingest_news_secret: a random shared secret string
--
-- Example (run once in Supabase SQL editor):
--   select vault.create_secret('https://<project-ref>.supabase.co', 'project_url');
--   select vault.create_secret('sb_publishable_...', 'publishable_key');
--   select vault.create_secret('<random>', 'ingest_news_secret');

-- Schedule ingest every 10 minutes
-- If you need to change cadence, update the cron string.
do $$
begin
  -- Some hosted Postgres instances may not have Vault installed/available.
  -- If Vault is not available, we skip creating the schedule in migrations.
  if exists (select 1 from pg_available_extensions where name = 'vault') then
    create extension if not exists vault;

    perform
      cron.schedule(
        'diginews-ingest-news-every-10m',
        '*/10 * * * *',
        $job$
        select
          net.http_post(
            url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
              || '/functions/v1/ingest-news',
            headers := jsonb_build_object(
              'Content-type', 'application/json',
              'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'publishable_key'),
              'x-ingest-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_news_secret')
            ),
            body := jsonb_build_object('trigger', 'pg_cron', 'time', now()::text)
          ) as request_id;
        $job$
      );
  else
    raise notice 'Vault extension not available; skipping ingest schedule creation. Create a schedule via Supabase Dashboard instead.';
  end if;
exception
  when others then
    -- Most commonly: job already exists. Keep migrations safe/idempotent.
    raise notice 'Skipping cron.schedule(diginews-ingest-news-every-10m): %', sqlerrm;
end;
$$;

