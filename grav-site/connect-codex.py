#!/usr/bin/env python3
"""Register the isolated Grav trial without changing other MCP connections."""
import os,re,shutil,subprocess,tomllib
from pathlib import Path
root=Path(__file__).resolve().parent
codex=shutil.which('codex')
if not codex:raise SystemExit('Run this script in the Codex terminal so the codex command is available.')
subprocess.run([codex,'mcp','add','association-commons-grav','--',shutil.which('python3') or 'python3',str(root/'codex-bridge.py')],check=True)
# Expose content tools only; backend ACLs independently enforce this boundary.
config=Path(os.environ.get('CODEX_HOME',str(Path.home()/'.codex')))/'config.toml'
text=config.read_text()
pattern=r'(?ms)^(\[mcp_servers\.(?:association-commons-grav|"association-commons-grav")\]\n)(.*?)(?=^\[|\Z)'
match=re.search(pattern,text)
if not match:raise SystemExit('Connection added, but its configuration section could not be located.')
body=re.sub(r'^enabled_tools\s*=.*\n','',match[2],flags=re.M)
allowed='enabled_tools = ["list_pages", "get_page", "create_page", "update_page", "move_page", "copy_page", "list_page_templates", "get_blueprint"]\n'
updated=text[:match.start()]+match[1]+allowed+body+text[match.end():]
tomllib.loads(updated)
config.write_text(updated)
print('Registered association-commons-grav. Reopen the Codex chat to load the connection.')
