#!/usr/bin/env python3
"""Start Grav and privately save the initial administrator login."""
import os,subprocess,time
from pathlib import Path
root=Path(__file__).resolve().parent.parent
os.chdir(root)
command=['docker','compose','-f','compose.grav.yml']
subprocess.run(command+['up','-d','--build'],check=True)
for attempt in range(45):
    result=subprocess.run(command+['exec','-T','--user','www-data','grav','cat','/var/www/html/user/data/commons-private/admin-login.txt'],capture_output=True)
    if result.returncode==0 and result.stdout:
        local=root/'.local';local.mkdir(exist_ok=True)
        target=local/'grav-admin.txt'
        descriptor=os.open(target,os.O_WRONLY|os.O_CREAT|os.O_TRUNC,0o600)
        with os.fdopen(descriptor,'wb') as output:output.write(result.stdout)
        target.chmod(0o600)
        print('Website: http://localhost:8388/en\nEditor: http://localhost:8388/admin\nInitial login saved privately in .local/grav-admin.txt. Change the password and email in your profile.')
        break
    time.sleep(2)
else:raise SystemExit('Grav did not finish startup. Check docker compose -f compose.grav.yml logs.')
