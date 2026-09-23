@echo off
title CodeMentor AI - Cloudflare Tunnel
echo ========================================
echo  CodeMentor AI - 内网穿透启动器
echo ========================================
echo.
echo 本地开发服务器：http://localhost:3000
echo 穿透地址：https://mae-remain-paragraph-shake.trycloudflare.com
echo.
echo 按任意键关闭隧道...
echo.

cloudflared tunnel --url http://localhost:3000 --no-autoupdate

pause
