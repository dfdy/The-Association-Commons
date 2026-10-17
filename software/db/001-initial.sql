CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS private;
CREATE TABLE IF NOT EXISTS content.migrations (version integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS content.state (singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton), revision bigint NOT NULL DEFAULT 1, seed_commit text NOT NULL, site_version text NOT NULL);
CREATE TABLE IF NOT EXISTS content.pages (filename text PRIMARY KEY, body text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS content.strings (key text PRIMARY KEY, value text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS content.documents (path text PRIMARY KEY, document jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS content.settings (key text PRIMARY KEY, value jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS private.records (key text PRIMARY KEY, body jsonb NOT NULL, submitted_at timestamptz NOT NULL DEFAULT now());
CREATE OR REPLACE FUNCTION content.changed() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 UPDATE content.state SET revision = revision + 1 WHERE singleton;
 RETURN NULL;
END $$;
DO $$
DECLARE name text;
BEGIN
 FOREACH name IN ARRAY ARRAY['pages','strings','documents','settings'] LOOP
  EXECUTE format('DROP TRIGGER IF EXISTS content_revision ON content.%I',name);
  EXECUTE format('CREATE TRIGGER content_revision AFTER INSERT OR UPDATE OR DELETE ON content.%I FOR EACH STATEMENT EXECUTE FUNCTION content.changed()',name);
 END LOOP;
END $$;
