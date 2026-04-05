@echo off
"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "feat: dashboard KPIs, country sub-modal, recharts, security fixes"
"C:\Program Files\Git\cmd\git.exe" push origin HEAD:main
