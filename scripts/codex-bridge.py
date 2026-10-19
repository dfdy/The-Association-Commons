#!/usr/bin/env python3
"""Launch the official Grav MCP server inside Docker; no credential in argv/config."""
import os,sys
from pathlib import Path
root=Path(__file__).resolve().parent.parent
os.chdir(root)
os.execvp('docker',['docker','compose','-f',str(root/'compose.yaml'),'exec','-T','--user','www-data','grav','node','/opt/commons-scripts/mcp.mjs'])
