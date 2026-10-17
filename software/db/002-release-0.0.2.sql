-- Owner-authorized release number update; retain installed editorial changes.
UPDATE content.pages SET body=replace(body,'0.0.1','0.0.2'),updated_at=now()
WHERE body LIKE '%0.0.1%';
UPDATE content.documents SET document=replace(document::text,'0.0.1','0.0.2')::jsonb,updated_at=now()
WHERE path='/privacy/' AND document::text LIKE '%0.0.1%';
UPDATE content.state SET site_version='0.0.2',revision=revision+1
WHERE site_version='0.0.1';
INSERT INTO content.migrations(version) VALUES(2);
