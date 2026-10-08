# MCD Infinity Banking API — Infrastructure & On-Premises Server Deployment Guide

This guide contains everything the Infrastructure / DevOps / Sysadmin team needs to deploy, configure, and maintain the **MCD Infinity API Server** on an internal local server (Linux VM, Bare-Metal, or Docker container).

---

## 1. System Overview

* **Application Name:** MCD Infinity Banking API & Administration Gateway
* **Technology Stack:** Node.js v20+ (Native ESM), RESTful HTTP, Vanilla JS embedded SPA
* **Default Listening Port:** `3000` (configurable via `PORT` environment variable)
* **Default Listening Interface:** `0.0.0.0` (all network interfaces)
* **Core Banking Backend:** Temenos Transact (T24) IRF Provider Container (`party/customers`)
* **Persistence Engine:** In-Memory High-Speed Cache + Atomic Dual-Write Disk Sync (`db.json` & `db.backup.json`)

---

## 2. Server & Network Requirements

### A. Hardware Recommendations
| Resource | Minimum | Recommended |
|---|---|---|
| **CPU** | 1 vCPU / Core | 2 vCPU / Cores |
| **RAM** | 512 MB | 1 GB - 2 GB |
| **Disk Space** | 200 MB | 1 GB (for logs and backups) |
| **OS** | Ubuntu 22.04 / Debian 12 / RHEL 8+ / Rocky Linux / Any Docker host |

### B. Network & Firewall Rules (Critical)

| Direction | Source | Destination | Protocol / Port | Purpose |
|---|---|---|---|---|
| **INBOUND** | Internal Network / Client Subnet | This Server | **TCP 3000** (or 80/443 if using Nginx) | Allows frontend apps, developers, and QA to consume MCD APIs and access Web Dashboard. |
| **OUTBOUND** | This Server | **192.168.1.157** (or internal Transact IP) | **TCP 8085** | **CRITICAL:** Allows this server to communicate with the Temenos Transact core banking API (`party/customers`). |

> ⚠️ **IMPORTANT FOR INFRA TEAM:** Ensure the server hosting this application has firewall permission and routing to reach `http://192.168.1.157:8085`. If the IP address or port of the Transact system is different in your network, update `TRANSACT_API_URL` in `.env`.

---

## 3. Deployment Method 1: Docker Compose (Recommended)

Docker Compose provides the fastest, most isolated, and reproducible deployment.

### Step 1: Clone or Copy the Repository
```bash
git clone https://github.com/AliAdil/mcd-infinity-api.git
cd mcd-infinity-api
```
*(Or extract `mcd-infinity-app.zip` to `/opt/mcd-infinity-api`)*

### Step 2: Configure Environment Variables
```bash
cp .env.example .env
nano .env
```
Ensure `TRANSACT_API_URL` points to your internal Temenos Transact instance.

### Step 3: Start the Container
```bash
docker compose up -d --build
```

### Step 4: Verify Container Status & Logs
```bash
docker compose ps
docker compose logs -f
```

### Step 5: Stop or Restart
```bash
# Restart
docker compose restart

# Stop
docker compose down

# Re-build after pulling updates
docker compose up -d --build
```

> **Data Persistence:** `docker-compose.yml` mounts `./db.json` and `./db.backup.json` to the host directory. All created prospects and records persist across container restarts and image updates.

---

## 4. Deployment Method 2: Linux Systemd Service (Native Node.js)

Use this method if deploying directly onto an Ubuntu, Debian, or RHEL Linux virtual machine.

### Step 1: Install Node.js (v20 or v22)
```bash
# Ubuntu / Debian:
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify:
node -v   # Should be v20.x or v22.x
npm -v
```

### Step 2: Copy Application Files
```bash
sudo mkdir -p /var/www/mcd-infinity-api
sudo chown -R $USER:$USER /var/www/mcd-infinity-api

# Copy application files into /var/www/mcd-infinity-api:
cp -r . /var/www/mcd-infinity-api/
cd /var/www/mcd-infinity-api

# Install production dependencies:
npm install --omit=dev
```

### Step 3: Setup Configuration
```bash
cp .env.example .env
# Edit variables as needed:
nano .env
```

### Step 4: Install Systemd Service
```bash
sudo cp mcd-infinity-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable mcd-infinity-api
sudo systemctl start mcd-infinity-api
```

### Step 5: Check Service Status & Logs
```bash
sudo systemctl status mcd-infinity-api
sudo journalctl -u mcd-infinity-api -f
```

---

## 5. Deployment Method 3: PM2 Process Manager

If using PM2 on a Linux or Windows server:

```bash
# Install PM2 globally
npm install -g pm2

# Navigate to app directory and install dependencies
cd /var/www/mcd-infinity-api
npm install --omit=dev

# Start via ecosystem config
pm2 start ecosystem.config.cjs

# Save PM2 process list and configure auto-start on server boot
pm2 save
pm2 startup
```

---

## 6. Optional: Nginx Reverse Proxy (Port 80 / 443 & Domain Setup)

To expose the API through standard HTTP (80) or HTTPS (443) with a domain name (e.g., `api.mcd.internal`):

```bash
sudo apt install -y nginx

# Copy nginx configuration:
sudo cp nginx.conf.example /etc/nginx/sites-available/mcd-infinity-api.conf
sudo ln -s /etc/nginx/sites-available/mcd-infinity-api.conf /etc/nginx/sites-enabled/

# Test and reload nginx:
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. Environment Variables Reference

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `3000` | Port on which the HTTP server listens. |
| `TRANSACT_API_URL` | `http://192.168.1.157:8085/irf-provider-container/api/v5.1.0/party/customers` | Target URL for Temenos Transact customer creation API. |
| `TRANSACT_COOKIE` | `ApplicationGatewayAffinity=...;ApplicationGatewayAffinityCORS=...` | Azure Application Gateway sticky session routing cookie. |
| `TRANSACT_BEARER_TOKEN` | *Pre-configured JWT* | OAuth2 JWT Bearer token used for authorization with Transact. |
| `MOCK_TRANSACT` | `false` | When `true`, simulates Transact responses locally without requiring an active network connection to T24. Useful for isolated testing. |

---

## 8. Verification & Health Smoke Tests

Once deployed, run these commands from the server (or any machine on the network) to verify that the service is healthy:

### 1. Health Probe
```bash
curl -i http://localhost:3000/health
```
**Expected Output:** `HTTP/1.1 200 OK` with JSON body `{"status":"ok","service":"MCD Infinity API Server",...}`

### 2. Web Management Console
Open in any browser:
```
http://<SERVER_IP>:3000/
```
You should see the MCD Infinity API Admin Dashboard with live record counts, table tabs, and JSON inspector.

### 3. Interactive Swagger API Docs
Open in any browser:
```
http://<SERVER_IP>:3000/docs
```

### 4. Create a Test Physical Prospect & Verify Transact Sync
```bash
curl -i -X POST http://localhost:3000/persons/physical \
  -H "Content-Type: application/json" \
  -d '{
    "FirstName": "Infra",
    "LastName": "Verification",
    "PersonalCode": "39501019999",
    "DateOfBirth": "1995-01-01",
    "PrimaryEmail": "infra.test@example.com",
    "PrimaryPhoneNumber": "+37060011222",
    "CountryCode": "LT"
  }'
```
**Expected Output:** `HTTP/1.1 201 Created` with an assigned `McdId` (e.g. `P6923`) and a `TransactID` returned from Temenos Transact.

---

## 9. Data Persistence & Backup Management

The application stores all entity data inside two files:
1. `db.json` — The active primary database file, updated atomically after every mutation.
2. `db.backup.json` — Mirrored automated backup file.

### Backup Strategy
To back up the database, simply copy `db.json`:
```bash
# Example nightly cron backup:
tar -czf /backups/mcd-db-$(date +%F).tar.gz /var/www/mcd-infinity-api/db.json
```

### Disaster Recovery
If `db.json` is ever corrupted or deleted:
1. The server automatically falls back to `db.backup.json` upon boot.
2. Or you can restore from a backup:
   ```bash
   cp /backups/mcd-db-2026-10-01.json /var/www/mcd-infinity-api/db.json
   sudo systemctl restart mcd-infinity-api
   ```
3. On boot, the server automatically reads the highest existing record ID and synchronizes sequence counters (`recalculateSequenceCounters()`), guaranteeing zero ID collisions.

---

## 10. Automated In-Process Test Suite

To verify full system functionality on the server without installing test dependencies:
```bash
cd /var/www/mcd-infinity-api
node test-runner.mjs
```
**Expected Output:** `ALL 36 TESTS PASSED! (0 failed)`
*(The test suite automatically takes a pre-test snapshot of `db.json` and restores it upon test completion, ensuring production data is never lost or modified by tests).*
