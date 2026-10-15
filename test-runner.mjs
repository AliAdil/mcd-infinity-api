import { EventEmitter } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleRequest, db } from './server.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = path.join(__dirname, 'db.json');

// Snapshot original DB state so testing never alters or wipes actual user records
const originalDbSnapshot = fs.existsSync(DB_FILE_PATH) ? fs.readFileSync(DB_FILE_PATH, 'utf-8') : null;

class MockReq extends EventEmitter {
  constructor(method, url, body = null) {
    super();
    this.method = method;
    this.url = url;
    this.headers = { host: 'localhost:3000' };
    if (body) {
      this.headers['content-type'] = 'application/json';
      process.nextTick(() => {
        this.emit('data', JSON.stringify(body));
        this.emit('end');
      });
    } else {
      process.nextTick(() => this.emit('end'));
    }
  }
}

class MockRes extends EventEmitter {
  constructor() {
    super();
    this.statusCode = 200;
    this.headers = {};
    this.body = '';
  }
  writeHead(code, headers) {
    this.statusCode = code;
    this.headers = headers;
  }
  end(data = '') {
    this.body += data;
    this.emit('finish');
  }
}

async function request(method, url, body = null) {
  return new Promise((resolve, reject) => {
    const req = new MockReq(method, url, body);
    const res = new MockRes();
    res.on('finish', () => {
      let json = null;
      try {
        json = JSON.parse(res.body);
      } catch {}
      resolve({
        status: res.statusCode,
        headers: res.headers,
        body: res.body,
        json
      });
    });
    handleRequest(req, res).catch(reject);
  });
}

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

let passed = 0;
let failed = 0;

async function assertTest(name, fn) {
  process.stdout.write(`Testing ${YELLOW}${name}${RESET} ... `);
  try {
    await fn();
    console.log(`${GREEN}PASSED${RESET}`);
    passed++;
  } catch (err) {
    console.log(`${RED}FAILED: ${err.message}${RESET}`);
    failed++;
  }
}

console.log(`${BLUE}====================================================${RESET}`);
console.log(`${BLUE}  MCD Infinity API Server In-Process Test Suite     ${RESET}`);
console.log(`${BLUE}====================================================${RESET}\n`);

// 1. Health & Docs
await assertTest('GET /health', async () => {
  const res = await request('GET', '/health');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.json.status !== 'ok') throw new Error(`Expected ok, got ${res.json.status}`);
});

await assertTest('GET /openapi.json', async () => {
  const res = await request('GET', '/openapi.json');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.json.openapi !== '3.0.1') throw new Error(`Expected 3.0.1, got ${res.json.openapi}`);
});

await assertTest('GET /docs', async () => {
  const res = await request('GET', '/docs');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.body.includes('SwaggerUIBundle')) throw new Error('Missing SwaggerUIBundle in HTML');
});

// 2. Physical Persons
await assertTest('GET /persons/physical', async () => {
  const res = await request('GET', '/persons/physical');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!Array.isArray(res.json) || res.json.length < 3) throw new Error('Expected array of persons');
});

await assertTest('GET /persons/physical (verify camelCase keys format)', async () => {
  const res = await request('GET', '/persons/physical');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  const first = res.json[0];
  const requiredKeys = ['mcdId', 'firstName', 'middleName', 'lastName', 'personalCode', 'countryCode', 'status', 'transactID', 'selectedProducts'];
  for (const k of requiredKeys) {
    if (!(k in first)) throw new Error(`Missing expected camelCase key '${k}' in GET /persons/physical response`);
  }
  if ('McdId' in first || 'FirstName' in first) throw new Error('Response still contains PascalCase keys');
});

await assertTest('GET /persons/physical (with filter)', async () => {
  const res = await request('GET', '/persons/physical?FirstName=Jonas&CountryCode=LT');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.json.length < 1 || !res.json.every(p => (p.firstName || p.FirstName).toLowerCase().includes('jonas') && (p.countryCode || p.CountryCode) === 'LT')) throw new Error('Filter failed');
});

await assertTest('POST /persons/physical (Create prospect with auto Transact sync)', async () => {
  const res = await request('POST', '/persons/physical', {
    firstName: 'Mantas',
    lastName: 'Jankauskas',
    personalCode: '39007070007',
    countryCode: 'LT',
    email: 'm.jankauskas@example.com',
    emailVerified: true,
    phoneNumber: '+37060099887',
    phoneNumberVerified: true,
    selectedProducts: [{ ProductCategory: 'ACCOUNTS', ProductId: 'STANDARD' }],
    mock: true
  });
  if (res.status !== 201) throw new Error(`Status ${res.status}`);
  const mcdId = res.json.mcdId || res.json.McdId;
  if (!mcdId || !/^F\d{8}$/.test(mcdId)) throw new Error(`Expected physical McdId to match /^F\\d{8}$/, got: ${mcdId}`);
  if ((res.json.status || res.json.Status) !== 'Prospect') throw new Error('Expected Status Prospect');
  if (!(res.json.transactID || res.json.TransactID)) throw new Error('Expected TransactID to be populated by Transact sync');
});

await assertTest('GET /persons/physical/F20014528', async () => {
  const res = await request('GET', '/persons/physical/F20014528');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if ((res.json.firstName || res.json.FirstName) !== 'Jonas') throw new Error('Wrong person returned');
});

await assertTest('GET /persons/physical/P1001 (Legacy ID backwards compatibility)', async () => {
  const res = await request('GET', '/persons/physical/P1001');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if ((res.json.firstName || res.json.FirstName) !== 'Jonas') throw new Error('Legacy lookup failed');
  if ((res.json.mcdId || res.json.McdId) !== 'F20014528') throw new Error('Expected new mcdId F20014528');
});

await assertTest('PUT /persons/physical/F20014528', async () => {
  const res = await request('PUT', '/persons/physical/F20014528', {
    PrimaryEmail: 'jonas.updated@example.com'
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if ((res.json.primaryEmail || res.json.PrimaryEmail) !== 'jonas.updated@example.com') throw new Error('Update failed');
});

await assertTest('POST /persons/physical/F20014528/consent', async () => {
  const res = await request('POST', '/persons/physical/F20014528/consent', {
    ConsentOffers: true,
    ConsentProfiling: true,
    ConsentPartnersOffers: true
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!(res.json.consentOffers || res.json.ConsentOffers)) throw new Error('ConsentOffers false');
});

await assertTest('GET /persons/physical/F20014530/potentialGuardians', async () => {
  const res = await request('GET', '/persons/physical/F20014530/potentialGuardians');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!Array.isArray(res.json) || res.json.length === 0) throw new Error('Expected guardians list');
});

await assertTest('PUT /persons/physical/F20014530/guardian/F20014528', async () => {
  const res = await request('PUT', '/persons/physical/F20014530/guardian/F20014528');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.json.success) throw new Error('Setting guardian failed');
});

await assertTest('GET /persons/physical/F20014528/children', async () => {
  const res = await request('GET', '/persons/physical/F20014528/children');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.json.length === 0 || (res.json[0].firstName || res.json[0].FirstName) !== 'Lukas') throw new Error('Children lookup failed');
});

await assertTest('PUT /persons/physical/F20014528/coapplicant/F20014529', async () => {
  const res = await request('PUT', '/persons/physical/F20014528/coapplicant/F20014529');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.json.success) throw new Error('Linking coapplicant failed');
});

// 3. Juridical Persons
await assertTest('GET /persons/juridical', async () => {
  const res = await request('GET', '/persons/juridical');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.json.length === 0) throw new Error('Empty juridical list');
});

await assertTest('GET /persons/juridical (by CompanyCode)', async () => {
  const res = await request('GET', '/persons/juridical?CompanyCode=305123456');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.json.length !== 1 || (res.json[0].companyCode || res.json[0].CompanyCode) !== '305123456') throw new Error('Query failed');
});

await assertTest('PUT /persons/juridical (Ensure prospect)', async () => {
  const res = await request('PUT', '/persons/juridical', {
    juridicalPerson: { companyCode: '306999888', countryCode: 'LT', fullName: 'UAB Inovaciju Centras' },
    representative: { firstName: 'Tomas', lastName: 'Vaitkus', personalCode: '38101010010', countryCode: 'LT' }
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.json.juridicalPerson || !res.json.representative) throw new Error('Missing returned entities');
});

await assertTest('GET /persons/juridical/J20014528', async () => {
  const res = await request('GET', '/persons/juridical/J20014528');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if ((res.json.companyCode || res.json.CompanyCode) !== '305123456') throw new Error('Wrong juridical entity');
});

await assertTest('GET /persons/juridical/J2001 (Legacy ID backwards compatibility)', async () => {
  const res = await request('GET', '/persons/juridical/J2001');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if ((res.json.companyCode || res.json.CompanyCode) !== '305123456') throw new Error('Legacy lookup failed');
  if ((res.json.mcdId || res.json.McdId) !== 'J20014528') throw new Error('Expected new mcdId J20014528');
});

await assertTest('PUT /persons/juridical/J20014528', async () => {
  const res = await request('PUT', '/persons/juridical/J20014528', {
    FullName: 'UAB Baltijos Technologijos Group'
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if ((res.json.fullName || res.json.FullName) !== 'UAB Baltijos Technologijos Group') throw new Error('Update failed');
});

await assertTest('POST /persons/juridical/J20014528/consent', async () => {
  const res = await request('POST', '/persons/juridical/J20014528/consent', {
    ConsentOffers: true,
    ConsentPartnersOffers: true
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!(res.json.consentOffers || res.json.ConsentOffers)) throw new Error('Consent offers update failed');
});

await assertTest('PUT /persons/juridical/accumulated', async () => {
  const res = await request('PUT', '/persons/juridical/accumulated', {
    juridicalPersonDetails: {
      fullName: 'UAB Naujas Startas 2',
      phoneNumber: '+37068811223',
      secondaryPhoneNumber: '+37052990000',
      registrationAddress: { countryCode: 'LT', city: 'Vilnius', street: 'Upės g. 21' },
      selectedProducts: [{ ProductCategory: 'ACCUMULATED', ProductId: 'FOUNDING_CAPITAL' }]
    },
    representativeDetails: {
      firstName: 'Simas',
      lastName: 'Kairys',
      personalCode: '39304040004',
      countryCode: 'LT'
    }
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  const aId = res.json.juridicalPerson.mcdId || res.json.juridicalPerson.McdId;
  if (!aId || !aId.startsWith('A')) throw new Error('Invalid accumulated McdId');
});

await assertTest('GET /persons/juridical/accumulated', async () => {
  const res = await request('GET', '/persons/juridical/accumulated?CompanyName=Naujas');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.json.length === 0) throw new Error('Expected match for Naujas');
});

await assertTest('POST /persons/juridical/A4001/transformFromAccumulated', async () => {
  const res = await request('POST', '/persons/juridical/A4001/transformFromAccumulated', {
    juridicalPersonDetails: { companyCode: '307111222' },
    representativeDetails: { firstName: 'Vytautas', lastName: 'Petrauskas', personalCode: '37905050005', countryCode: 'LT' }
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  const jId = res.json.juridicalPerson.mcdId || res.json.juridicalPerson.McdId;
  if (!jId || !/^J\d{8}$/.test(jId)) throw new Error(`Expected new Juridical McdId to match /^J\\d{8}$/, got: ${jId}`);
});

await assertTest('GET /persons/juridical/J20014528/representatives/R3001', async () => {
  const res = await request('GET', '/persons/juridical/J20014528/representatives/R3001');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if ((res.json.mcdId || res.json.McdId) !== 'R3001') throw new Error('Validation failed');
});

// 4. Representatives
await assertTest('GET /persons/representatives', async () => {
  const res = await request('GET', '/persons/representatives');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.json.length === 0) throw new Error('Empty representative list');
});

await assertTest('GET /persons/representatives/R3001', async () => {
  const res = await request('GET', '/persons/representatives/R3001');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if ((res.json.firstName || res.json.FirstName) !== 'Vytautas') throw new Error('Wrong representative returned');
});

await assertTest('PUT /persons/representatives/R3001', async () => {
  const res = await request('PUT', '/persons/representatives/R3001', {
    LanguageCode: 'en',
    PrimaryEmail: 'v.petrauskas.updated@example.com'
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if ((res.json.languageCode || res.json.LanguageCode) !== 'en') throw new Error('Update failed');
});

// 5. Admin DB Direct Browser Edit Endpoints
await assertTest('PUT /admin/db/physical/F20014528 (Direct browser update)', async () => {
  const res = await request('PUT', '/admin/db/physical/F20014528', {
    FirstName: 'Jonas-Edited',
    PrimaryEmail: 'jonas.edited@example.com'
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.json.success) throw new Error('Update failed');
  if ((res.json.record.firstName || res.json.record.FirstName) !== 'Jonas-Edited') throw new Error('Field not updated');
});

await assertTest('POST /admin/db/physical (Direct browser add)', async () => {
  const res = await request('POST', '/admin/db/physical', {
    FirstName: 'Test',
    LastName: 'User',
    PersonalCode: '39900000000',
    CountryCode: 'LT',
    Status: 'Prospect'
  });
  if (res.status !== 201) throw new Error(`Status ${res.status}`);
  if (!res.json.success) throw new Error('Add failed');
});

await assertTest('DELETE /admin/db/physical/F20014528 (Direct browser delete)', async () => {
  const res = await request('DELETE', '/admin/db/physical/F20014528');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.json.success) throw new Error('Delete failed');
});

await assertTest('GET /persons/physical/by-personal-code/:code', async () => {
  const res = await request('GET', '/persons/physical/by-personal-code/48802020002');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if ((res.json.personalCode || res.json.PersonalCode) !== '48802020002') throw new Error('PersonalCode mismatch');
  if ((res.json.mcdId || res.json.McdId) !== 'F20014529') throw new Error('McdId mismatch');
});

await assertTest('POST /transact/sync-customer (Customer already has TransactID -> alreadySynced: true)', async () => {
  const res = await request('POST', '/transact/sync-customer', {
    personalCode: '48802020002'
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(res.json)}`);
  if (!res.json.success) throw new Error('Sync failed');
  if (!res.json.alreadySynced) throw new Error('Expected alreadySynced: true');
  if (!res.json.message.includes('already has TransactID')) throw new Error('Expected already has TransactID message');
});

await assertTest('POST /transact/sync-customer (Force re-sync with force: true)', async () => {
  const res = await request('POST', '/transact/sync-customer', {
    personalCode: '48802020002',
    force: true,
    mock: true
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(res.json)}`);
  if (!res.json.success) throw new Error('Sync failed');
  if (res.json.alreadySynced) throw new Error('Expected alreadySynced to be false on forced sync');
});

await assertTest('POST /persons/physical (Create prospect with pre-existing TransactID -> skips Transact API)', async () => {
  const res = await request('POST', '/persons/physical', {
    firstName: 'Saulius',
    lastName: 'Prūsaitis',
    personalCode: '38101010055',
    TransactID: 'TX-EXISTING-999',
    countryCode: 'LT'
  });
  if (res.status !== 201) throw new Error(`Status ${res.status}`);
  if ((res.json.transactID || res.json.TransactID) !== 'TX-EXISTING-999') throw new Error('Expected TransactID to be preserved');
  if (!res.json.alreadySynced) throw new Error('Expected alreadySynced: true');
});

await assertTest('POST /transact/sync-customer (Missing PersonalCode -> 400)', async () => {
  const res = await request('POST', '/transact/sync-customer', {});
  if (res.status !== 400) throw new Error(`Status ${res.status} (expected 400)`);
  if (res.json.success !== false) throw new Error('Expected success: false');
});

await assertTest('POST /transact/sync-customer (Unknown PersonalCode -> 404)', async () => {
  const res = await request('POST', '/transact/sync-customer', { personalCode: '00000000000' });
  if (res.status !== 404) throw new Error(`Status ${res.status} (expected 404)`);
  if (res.json.success !== false) throw new Error('Expected success: false');
});

// -------------------------------------------------------------
// Formpipe LaserNet Document Services Tests
// -------------------------------------------------------------
await assertTest('POST /formpipe-adapter/v1/document-generation/generate', async () => {
  const res = await request('POST', '/formpipe-adapter/v1/document-generation/generate', {
    payloadContentType: 'application/json',
    payloadType: 'my-template',
    payload: { clients: [{ client: { firstName: 'John', lastName: 'Doe' } }] }
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.json.status !== '200') throw new Error(`Expected status '200', got ${res.json.status}`);
  if (res.json.DocID !== '64424517880') throw new Error(`Expected DocID 64424517880, got ${res.json.DocID}`);
  if (!res.json.DMLink || !res.json.DMLink.includes('64424517880')) throw new Error(`Invalid DMLink: ${res.json.DMLink}`);
  if (res.json.message !== 'OK') throw new Error(`Expected message 'OK', got ${res.json.message}`);
});

await assertTest('POST /formpipe-adapter/v1/document-generation/documentonly (raw binary PDF bytes)', async () => {
  const res = await request('POST', '/formpipe-adapter/v1/document-generation/documentonly', {
    payloadContentType: 'application/json'
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.headers['Content-Type'] !== 'application/pdf') throw new Error(`Expected application/pdf header, got ${res.headers['Content-Type']}`);
  if (!res.body.startsWith('%PDF-1.4')) throw new Error('Expected PDF header %PDF-1.4 in binary body');
  if (res.body.length < 50000) throw new Error(`PDF length suspiciously small: ${res.body.length}`);
});

await assertTest('POST /formpipe-adapter/v1/document-generation/documentonly?format=base64', async () => {
  const res = await request('POST', '/formpipe-adapter/v1/document-generation/documentonly?format=base64', {});
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.body.startsWith('JVBERi0x')) throw new Error('Expected Base64 starting with JVBERi0x');
});

await assertTest('GET /formpipe-adapter/v1/documents/by-id/68719477778/file (Base64 file string)', async () => {
  const res = await request('GET', '/formpipe-adapter/v1/documents/by-id/68719477778/file');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.body.startsWith('JVBERi0x')) throw new Error('Expected Base64 starting with JVBERi0x');
  if (res.body.length < 100000) throw new Error(`Base64 length suspiciously small: ${res.body.length}`);
});

await assertTest('GET /formpipe-adapter/v1/documents/by-id/68719477778/file?format=pdf (Binary PDF)', async () => {
  const res = await request('GET', '/formpipe-adapter/v1/documents/by-id/68719477778/file?format=pdf');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.headers['Content-Type'] !== 'application/pdf') throw new Error(`Expected application/pdf, got ${res.headers['Content-Type']}`);
  if (!res.body.startsWith('%PDF-1.4')) throw new Error('Expected %PDF-1.4 binary header');
});

await assertTest('GET /formpipe-adapter/v1/documents/by-id/68719477778/file?format=json (JSON wrapper)', async () => {
  const res = await request('GET', '/formpipe-adapter/v1/documents/by-id/68719477778/file?format=json');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.json.status !== '200') throw new Error(`Expected status '200'`);
  if (res.json.DocID !== '68719477778') throw new Error(`Expected DocID 68719477778`);
  if (!res.json.file || !res.json.file.startsWith('JVBERi0x')) throw new Error('Invalid Base64 in json.file');
});

await assertTest('PUT /formpipe-adapter/v1/documents/by-id/68719477778 (Upload document bytes)', async () => {
  const res = await request('PUT', '/formpipe-adapter/v1/documents/by-id/68719477778', {
    test: 'sample byte payload'
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.json.status !== '200') throw new Error(`Expected status '200'`);
  if (res.json.DocID !== '68719477778') throw new Error(`Expected DocID 68719477778`);
  if (res.json.message !== 'OK') throw new Error(`Expected OK message`);
});

await assertTest('PUT /documents/by-id/68719477778 (Alternate prefix for Java client)', async () => {
  const res = await request('PUT', '/documents/by-id/68719477778', {
    test: 'sample byte payload alternate'
  });
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.json.status !== '200') throw new Error(`Expected status '200'`);
  if (res.json.DocID !== '68719477778') throw new Error(`Expected DocID 68719477778`);
});

await assertTest('GET /documents/by-id/68719477778/file (Alternate prefix for Java client)', async () => {
  const res = await request('GET', '/documents/by-id/68719477778/file');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (res.body.length === 0) throw new Error('Expected non-empty body');
});

await assertTest('POST /admin/db/reset (Reset to seed)', async () => {
  const res = await request('POST', '/admin/db/reset');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.json.success) throw new Error('Reset failed');
});

// Restore original database state so user data is never wiped by tests
if (originalDbSnapshot) {
  try {
    fs.writeFileSync(DB_FILE_PATH, originalDbSnapshot, 'utf-8');
    const { loadDbFromFile } = await import('./server.mjs');
    loadDbFromFile();
    console.log('Restored original database state after test run.');
  } catch (err) {
    console.error('Failed to restore original database state:', err.message);
  }
}

console.log(`\n${GREEN}====================================================${RESET}`);
console.log(`${GREEN}  ALL ${passed} TESTS PASSED! (${failed} failed)              ${RESET}`);
console.log(`${GREEN}====================================================${RESET}`);

if (failed > 0) process.exit(1);
