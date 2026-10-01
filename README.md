# MCD Infinity API - Mock & Local Application Server

A fully functional, standalone Node.js REST API server implementing the **MCD Infinity API (v1.0.0)** specification from Apidog.

This server bridges the **Infinity** digital banking front-end with **MCD** (Master Customer Data core system), incorporating identity models, KYC/AML screening, and Lithuanian national registry integrations (RC / JAR — *Registrų Centras / Juridinių Asmenų Registras*).

---

## Features

- **All 21 REST API Endpoints**: Full CRUD and domain flows for physical persons, juridical (SME) clients, accumulated accounts, and legal representatives.
- **Interactive Swagger UI**: Hosted at `/docs` backed by `/openapi.json`.
- **Live Web Dashboard & API Explorer**: Hosted at `/` for quick point-and-click live endpoint inspection.
- **In-Memory Store**: Pre-seeded with realistic Lithuanian test entities (e.g. `P1001`, `P1002`, `P1003`, `J2001`, `R3001`, `A4001`).
- **Zero External Dependencies**: Uses native Node.js 22 modules (`node:http`, `node:fs`, `node:path`), making it fast, robust, and free of npm/proxy issues.

---

## Quick Start

### 1. Launch Server

Run the server using Node.js:

```bash
cd /Users/aliadil/.gemini/antigravity/scratch/mcd-infinity-app
node server.mjs
```

By default, the server listens on **`http://localhost:3000`**. You can customize the port:

```bash
PORT=8080 node server.mjs
```

### 2. Access in Browser

- **Interactive Dashboard & Console:** [http://localhost:3000/](http://localhost:3000/)
- **Interactive Database Viewer:** [http://localhost:3000/](http://localhost:3000/) (Built into the dashboard with table views, row inspector, and JSON export)
- **Database JSON Dump:** [http://localhost:3000/admin/db](http://localhost:3000/admin/db)
- **Local DB File:** [`db.json`](file:///Users/aliadil/.gemini/antigravity/scratch/mcd-infinity-app/db.json) (auto-synced on disk)
- **Interactive Swagger UI:** [http://localhost:3000/docs](http://localhost:3000/docs)
- **OpenAPI 3.0 Specification:** [http://localhost:3000/openapi.json](http://localhost:3000/openapi.json)
- **Health Check:** [http://localhost:3000/health](http://localhost:3000/health)

---

## How to Inspect the Database

You have 3 ways to view the database:

### 1. In Your Web Browser (Visual Table Inspector)
Navigate to [**http://localhost:3000/**](http://localhost:3000/).
- The default **Database Viewer** tab displays all 4 tables: *Physical Persons*, *Juridical Persons (SME)*, *Representatives*, and *Accumulated Accounts*.
- Click on any row to view the full JSON document and relational links in the inspector.
- Use **Refresh DB** to see newly created entities or **Reset to Seed** to revert modifications.

### 2. In Terminal or Code (JSON Endpoint)
To fetch the entire live database snapshot:
```bash
curl -s http://localhost:3000/admin/db | jq .
```
Or to reset back to initial seed data:
```bash
curl -X POST http://localhost:3000/admin/db/reset
```

### 3. In Your Code Editor (`db.json`)
The server persists state to:
`/Users/aliadil/.gemini/antigravity/scratch/mcd-infinity-app/db.json`
You can open and view this JSON file in any text editor or IDE. Every API call that creates or modifies entities automatically updates this file.

### 3. Run Automated Tests

To test all 21 endpoints at once:

```bash
bash test-api.sh
```

---

## API Endpoints & Usage Details

### 1. Physical Persons (`/persons/physical`)

#### Search physical persons
Check if a client exists after Infinity login, or search guardian information:
```bash
curl -X GET "http://localhost:3000/persons/physical?FirstName=Jonas&CountryCode=LT"
```

#### Create physical prospect
Create a new adult or junior prospect card in MCD:
```bash
curl -X POST "http://localhost:3000/persons/physical" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Mantas",
    "lastName": "Jankauskas",
    "personalCode": "39007070007",
    "countryCode": "LT",
    "dateOfBirth": "1990-07-07",
    "email": "m.jankauskas@example.com",
    "emailVerified": true,
    "phoneNumber": "+37060099887",
    "phoneNumberVerified": true,
    "selectedProducts": [{"ProductCategory": "ACCOUNTS", "ProductId": "STANDARD"}]
  }'
```

#### Get physical person details
```bash
curl -X GET "http://localhost:3000/persons/physical/P1001"
```

#### Update physical person
```bash
curl -X PUT "http://localhost:3000/persons/physical/P1001" \
  -H "Content-Type: application/json" \
  -d '{
    "PrimaryEmail": "jonas.updated@example.com",
    "PrimaryPhoneNumber": "+37060011223"
  }'
```

#### Update marketing & profiling consents
```bash
curl -X POST "http://localhost:3000/persons/physical/P1001/consent" \
  -H "Content-Type: application/json" \
  -d '{
    "ConsentOffers": true,
    "ConsentProfiling": true,
    "ConsentPartnersOffers": true,
    "ValidUntil": "2029-12-31"
  }'
```

#### Get potential junior guardians
```bash
curl -X GET "http://localhost:3000/persons/physical/P1003/potentialGuardians"
```

#### Set junior guardian
```bash
curl -X PUT "http://localhost:3000/persons/physical/P1003/guardian/P1001"
```

#### Get children of client
```bash
curl -X GET "http://localhost:3000/persons/physical/P1001/children"
```

#### Link co-applicants
```bash
curl -X PUT "http://localhost:3000/persons/physical/P1001/coapplicant/P1002"
```

---

### 2. Juridical Persons / SME (`/persons/juridical`)

#### Search juridical person
```bash
curl -X GET "http://localhost:3000/persons/juridical?CompanyCode=305123456"
```

#### Ensure juridical prospect with representative
```bash
curl -X PUT "http://localhost:3000/persons/juridical" \
  -H "Content-Type: application/json" \
  -d '{
    "juridicalPerson": {
      "companyCode": "306999888",
      "countryCode": "LT",
      "fullName": "UAB Inovaciju Centras"
    },
    "representative": {
      "firstName": "Tomas",
      "lastName": "Vaitkus",
      "personalCode": "38101010010",
      "countryCode": "LT"
    }
  }'
```

#### Get juridical person details
```bash
curl -X GET "http://localhost:3000/persons/juridical/J2001"
```

#### Update juridical person
```bash
curl -X PUT "http://localhost:3000/persons/juridical/J2001" \
  -H "Content-Type: application/json" \
  -d '{
    "FullName": "UAB Baltijos Technologijos Group",
    "PrimaryEmail": "contact@baltiantech.lt"
  }'
```

#### Update juridical consents
```bash
curl -X POST "http://localhost:3000/persons/juridical/J2001/consent" \
  -H "Content-Type: application/json" \
  -d '{
    "ConsentOffers": true,
    "ConsentPartnersOffers": true
  }'
```

#### Ensure accumulated account with representative
```bash
curl -X PUT "http://localhost:3000/persons/juridical/accumulated" \
  -H "Content-Type: application/json" \
  -d '{
    "juridicalPersonDetails": {
      "fullName": "UAB Naujas Startas 2",
      "phoneNumber": "+37068811223",
      "secondaryPhoneNumber": "+37052990000",
      "registrationAddress": {
        "countryCode": "LT",
        "city": "Vilnius",
        "street": "Upes g. 21"
      },
      "selectedProducts": [
        {"ProductCategory": "ACCUMULATED", "ProductId": "FOUNDING_CAPITAL"}
      ]
    },
    "representativeDetails": {
      "firstName": "Simas",
      "lastName": "Kairys",
      "personalCode": "39304040004",
      "countryCode": "LT"
    }
  }'
```

#### Search accumulated accounts
```bash
curl -X GET "http://localhost:3000/persons/juridical/accumulated?CompanyName=Naujas"
```

#### Transform accumulated account into proper SME
```bash
curl -X POST "http://localhost:3000/persons/juridical/A4001/transformFromAccumulated" \
  -H "Content-Type: application/json" \
  -d '{
    "juridicalPersonDetails": {
      "companyCode": "307111222"
    },
    "representativeDetails": {
      "firstName": "Vytautas",
      "lastName": "Petrauskas",
      "personalCode": "37905050005",
      "countryCode": "LT"
    }
  }'
```

#### Validate legal representative
```bash
curl -X GET "http://localhost:3000/persons/juridical/J2001/representatives/R3001"
```

---

### 3. Representatives (`/persons/representatives`)

#### Search representatives
```bash
curl -X GET "http://localhost:3000/persons/representatives?FirstName=Vytautas&CountryCode=LT"
```

#### Get representative details
```bash
curl -X GET "http://localhost:3000/persons/representatives/R3001"
```

#### Update representative
```bash
curl -X PUT "http://localhost:3000/persons/representatives/R3001" \
  -H "Content-Type: application/json" \
  -d '{
    "LanguageCode": "en",
    "PrimaryEmail": "v.petrauskas.updated@example.com"
  }'
```

---

## Pre-seeded Data Reference

| Entity Type | MCD ID | Key Identifiers / Names | Details |
|---|---|---|---|
| **Physical Person** | `P1001` | Jonas Kazlauskas (`38501010001`) | Existing client, adult, guardian of P1003 |
| **Physical Person** | `P1002` | Ieva Kazlauskienė (`48802020002`) | Existing client, adult, coapplicant |
| **Physical Person (Junior)** | `P1003` | Lukas Kazlauskas (`51503030003`) | Minor client (born 2015), ward of P1001 |
| **Juridical Person** | `J2001` | UAB Baltijos Technologijos (`305123456`) | Active SME with legal representative R3001 |
| **Representative** | `R3001` | Vytautas Petrauskas (`37905050005`) | Authorized signatory & legal representative |
| **Accumulated Account** | `A4001` | UAB Naujas Startas (`EST-998877`) | Establishing capital account awaiting transformation |
