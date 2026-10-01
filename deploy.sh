#!/usr/bin/env bash
# Hostinger VPS Quick Deployment Script for MCD Infinity API
set -e

echo "=== Installing Node.js & PM2 on Hostinger VPS ==="
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
  sudo npm install -g pm2
fi

echo "=== Starting MCD Infinity API with PM2 ==="
pm2 stop mcd-infinity-api 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME 2>/dev/null || true

echo "=== MCD Infinity API is now live with PM2! ==="
pm2 status
