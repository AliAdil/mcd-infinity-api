import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const DB_FILE_PATH = path.join(__dirname, 'db.json');
const DB_BACKUP_PATH = path.join(__dirname, 'db.backup.json');

// Load OpenAPI specification
const openapiSpecPath = path.join(__dirname, 'openapi.json');
let openapiSpec = {};
try {
  openapiSpec = JSON.parse(fs.readFileSync(openapiSpecPath, 'utf-8'));
} catch (err) {
  console.error('Failed to load openapi.json:', err.message);
}

// Formpipe Sample PDF asset configuration (LaserNet 10 Engine)
const FORMPIPE_PDF_PATH = path.join(__dirname, 'formpipe-sample.pdf');
export let formpipePdfBuffer = null;
export let formpipePdfBase64 = '';
try {
  if (fs.existsSync(FORMPIPE_PDF_PATH)) {
    formpipePdfBuffer = fs.readFileSync(FORMPIPE_PDF_PATH);
    formpipePdfBase64 = formpipePdfBuffer.toString('base64');
  }
} catch (err) {
  console.error('Failed to load Formpipe sample PDF:', err.message);
}

// Initial seed data
const initialSeedData = {
  physicalPersons: [
    ['F20014528', {
      McdId: 'F20014528',
      mcdId: 'F20014528',
      FirstName: 'Jonas',
      MiddleName: null,
      LastName: 'Kazlauskas',
      PersonalCode: '38501010001',
      CountryCode: 'LT',
      Gender: 'MALE',
      Status: 'Existing',
      TransactID: 'TX-98765',
      DateOfBirth: '1985-01-01',
      DateOfDeath: null,
      BirthCountryCode: 'LT',
      BirthCity: 'Vilnius',
      LanguageCode: 'lt',
      PrimaryEmail: 'jonas.kazlauskas@example.com',
      PrimaryEmailVerified: true,
      SecondaryEmail: null,
      PrimaryPhoneNumber: '+37060012345',
      PrimaryPhoneNumberVerified: true,
      SecondaryPhoneNumber: null,
      RegistrationAddress: {
        countryCode: 'LT',
        buildingNumber: '12',
        flatNumber: '4',
        postCode: 'LT-01111',
        city: 'Vilnius',
        street: 'Gedimino pr.',
        municipality: 'Vilniaus m.',
        fullAddress: 'Gedimino pr. 12-4, LT-01111 Vilnius'
      },
      ResidenceAddress: {
        countryCode: 'LT',
        buildingNumber: '12',
        flatNumber: '4',
        postCode: 'LT-01111',
        city: 'Vilnius',
        street: 'Gedimino pr.',
        municipality: 'Vilniaus m.',
        fullAddress: 'Gedimino pr. 12-4, LT-01111 Vilnius'
      },
      CorrespondenceAddress: {
        countryCode: 'LT',
        buildingNumber: '12',
        flatNumber: '4',
        postCode: 'LT-01111',
        city: 'Vilnius',
        street: 'Gedimino pr.',
        municipality: 'Vilniaus m.',
        fullAddress: 'Gedimino pr. 12-4, LT-01111 Vilnius'
      },
      Consents: {
        ConsentOffers: true,
        ConsentProfiling: false,
        ConsentPartnersOffers: false,
        Date: '2026-01-10T10:00:00.000Z',
        ValidUntil: '2028-12-31'
      },
      Nationalities: ['LT'],
      IdDocuments: [
        {
          Id: 'DOC-101',
          Number: '12345678',
          TypeCode: 'PASSPORT',
          IssuerCountryCode: 'LT',
          IssueDate: '2020-05-15',
          ExpirationDate: '2030-05-15',
          FormpipeFileId: 'FP-888',
          NationalIdentifier: {
            Type: 'PERSONAL_CODE',
            Value: '38501010001',
            CountryCode: 'LT'
          }
        }
      ],
      OndatoCheckValid: true,
      AmlScreening: {
        LastAmlResultDate: '2026-02-01T08:00:00.000Z',
        AmlResult: 'PASSED',
        SmaApprovalStatus: 'APPROVED',
        SmaDecisionDate: '2026-02-01T08:00:00.000Z'
      },
      Kyc: {
        IsKycRequired: false,
        ExpirationDate: '2027-01-01'
      },
      SelectedProducts: [
        { ProductCategory: 'ACCOUNTS', ProductId: 'CURRENT_ACCOUNT_STANDARD' }
      ],
      HasParentalPermissionToManageProducts: null,
      IsMinor: false,
      IsEmancipatedMinor: false,
      IsIncapable: false,
      guardianMcdId: null,
      coapplicantMcdId: null
    }],
    ['F20014529', {
      McdId: 'F20014529',
      mcdId: 'F20014529',
      FirstName: 'Ieva',
      MiddleName: null,
      LastName: 'Kazlauskienė',
      PersonalCode: '48802020002',
      CountryCode: 'LT',
      Gender: 'FEMALE',
      Status: 'Existing',
      TransactID: 'TX-98766',
      DateOfBirth: '1988-02-02',
      DateOfDeath: null,
      BirthCountryCode: 'LT',
      BirthCity: 'Kaunas',
      LanguageCode: 'lt',
      PrimaryEmail: 'ieva.k@example.com',
      PrimaryEmailVerified: true,
      SecondaryEmail: null,
      PrimaryPhoneNumber: '+37060023456',
      PrimaryPhoneNumberVerified: true,
      SecondaryPhoneNumber: null,
      RegistrationAddress: {
        countryCode: 'LT',
        buildingNumber: '12',
        flatNumber: '4',
        postCode: 'LT-01111',
        city: 'Vilnius',
        street: 'Gedimino pr.',
        fullAddress: 'Gedimino pr. 12-4, LT-01111 Vilnius'
      },
      ResidenceAddress: null,
      CorrespondenceAddress: {
        countryCode: 'LT',
        buildingNumber: '12',
        flatNumber: '4',
        postCode: 'LT-01111',
        city: 'Vilnius',
        street: 'Gedimino pr.',
        fullAddress: 'Gedimino pr. 12-4, LT-01111 Vilnius'
      },
      Consents: {
        ConsentOffers: true,
        ConsentProfiling: true,
        ConsentPartnersOffers: true,
        Date: '2026-01-10T10:00:00.000Z',
        ValidUntil: '2027-01-01'
      },
      Nationalities: ['LT'],
      IdDocuments: [],
      OndatoCheckValid: true,
      AmlScreening: {
        LastAmlResultDate: '2026-02-01T08:00:00.000Z',
        AmlResult: 'PASSED',
        SmaApprovalStatus: 'APPROVED',
        SmaDecisionDate: '2026-02-01T08:00:00.000Z'
      },
      Kyc: {
        IsKycRequired: false,
        ExpirationDate: '2027-05-01'
      },
      SelectedProducts: [
        { ProductCategory: 'ACCOUNTS', ProductId: 'CURRENT_ACCOUNT_PREMIUM' }
      ],
      HasParentalPermissionToManageProducts: null,
      IsMinor: false,
      IsEmancipatedMinor: false,
      IsIncapable: false,
      guardianMcdId: null,
      coapplicantMcdId: null
    }],
    ['F20014530', {
      McdId: 'F20014530',
      mcdId: 'F20014530',
      FirstName: 'Lukas',
      MiddleName: null,
      LastName: 'Kazlauskas',
      PersonalCode: '51503030003',
      CountryCode: 'LT',
      Gender: 'MALE',
      Status: 'Existing',
      TransactID: 'TX-98767',
      DateOfBirth: '2015-03-03',
      DateOfDeath: null,
      BirthCountryCode: 'LT',
      BirthCity: 'Vilnius',
      LanguageCode: 'lt',
      PrimaryEmail: null,
      PrimaryEmailVerified: false,
      SecondaryEmail: null,
      PrimaryPhoneNumber: null,
      PrimaryPhoneNumberVerified: false,
      SecondaryPhoneNumber: null,
      RegistrationAddress: {
        countryCode: 'LT',
        buildingNumber: '12',
        flatNumber: '4',
        postCode: 'LT-01111',
        city: 'Vilnius',
        street: 'Gedimino pr.',
        fullAddress: 'Gedimino pr. 12-4, LT-01111 Vilnius'
      },
      ResidenceAddress: null,
      CorrespondenceAddress: {
        countryCode: 'LT',
        buildingNumber: '12',
        flatNumber: '4',
        postCode: 'LT-01111',
        city: 'Vilnius',
        street: 'Gedimino pr.',
        fullAddress: 'Gedimino pr. 12-4, LT-01111 Vilnius'
      },
      Consents: {
        ConsentOffers: false,
        ConsentProfiling: false,
        ConsentPartnersOffers: false,
        Date: '2026-01-10T10:00:00.000Z',
        ValidUntil: '2026-12-31'
      },
      Nationalities: ['LT'],
      IdDocuments: [],
      OndatoCheckValid: true,
      AmlScreening: null,
      Kyc: {
        IsKycRequired: false,
        ExpirationDate: '2030-01-01'
      },
      SelectedProducts: [
        { ProductCategory: 'JUNIOR', ProductId: 'JUNIOR_SAVINGS_CARD' }
      ],
      HasParentalPermissionToManageProducts: true,
      IsMinor: true,
      IsEmancipatedMinor: false,
      IsIncapable: false,
      guardianMcdId: 'F20014528',
      coapplicantMcdId: null
    }]
  ],

  juridicalPersons: [
    ['J20014528', {
      McdId: 'J20014528',
      mcdId: 'J20014528',
      FullName: 'UAB Baltijos Technologijos',
      CompanyCode: '305123456',
      CountryCode: 'LT',
      Status: 'Existing',
      TransactId: 'TX-J-54321',
      PrimaryEmail: 'info@baltiantech.lt',
      PrimaryEmailVerified: true,
      SecondaryEmail: 'finance@baltiantech.lt',
      PrimaryPhoneNumber: '+37052123456',
      PrimaryPhoneNumberVerified: true,
      SecondaryPhoneNumber: null,
      RegistrationAddress: {
        countryCode: 'LT',
        buildingNumber: '10',
        flatNumber: '101',
        postCode: 'LT-08105',
        city: 'Vilnius',
        street: 'Saltoniškių g.',
        fullAddress: 'Saltoniškių g. 10-101, LT-08105 Vilnius'
      },
      ResidenceAddress: null,
      CorrespondenceAddress: {
        countryCode: 'LT',
        buildingNumber: '10',
        flatNumber: '101',
        postCode: 'LT-08105',
        city: 'Vilnius',
        street: 'Saltoniškių g.',
        fullAddress: 'Saltoniškių g. 10-101, LT-08105 Vilnius'
      },
      Consents: {
        ConsentOffers: true,
        ConsentPartnersOffers: false
      },
      AmlScreening: {
        LastAmlResultDate: '2026-02-01T08:00:00.000Z',
        AmlResult: 'PASSED',
        SmaApprovalStatus: 'APPROVED',
        SmaDecisionDate: '2026-02-01T08:00:00.000Z'
      },
      Kyc: {
        IsKycRequired: false,
        ExpirationDate: '2027-10-01'
      },
      SelectedProducts: [
        { ProductCategory: 'BUSINESS_ACCOUNTS', ProductId: 'SME_CORPORATE_PACKAGE' }
      ],
      FinalBeneficiariesMissing: false,
      RepresentativeMcdId: 'R3001'
    }]
  ],

  representatives: [
    ['R3001', {
      McdId: 'R3001',
      FirstName: 'Vytautas',
      MiddleName: null,
      LastName: 'Petrauskas',
      PersonalCode: '37905050005',
      CountryCode: 'LT',
      Gender: 'MALE',
      DateOfBirth: '1979-05-05',
      BirthCountryCode: 'LT',
      BirthCity: 'Klaipėda',
      LanguageCode: 'lt',
      PrimaryEmail: 'v.petrauskas@baltiantech.lt',
      PrimaryEmailVerified: true,
      SecondaryEmail: null,
      PrimaryPhoneNumber: '+37068899000',
      PrimaryPhoneNumberVerified: true,
      SecondaryPhoneNumber: null,
      RegistrationAddress: {
        countryCode: 'LT',
        buildingNumber: '5',
        flatNumber: '12',
        postCode: 'LT-03100',
        city: 'Vilnius',
        street: 'Konstitucijos pr.',
        fullAddress: 'Konstitucijos pr. 5-12, LT-03100 Vilnius'
      },
      ResidenceAddress: null,
      CorrespondenceAddress: {
        countryCode: 'LT',
        buildingNumber: '5',
        flatNumber: '12',
        postCode: 'LT-03100',
        city: 'Vilnius',
        street: 'Konstitucijos pr.',
        fullAddress: 'Konstitucijos pr. 5-12, LT-03100 Vilnius'
      },
      Consents: {
        ConsentOffers: true,
        ConsentProfiling: false,
        ConsentPartnersOffers: false,
        Date: '2026-01-10T10:00:00.000Z',
        ValidUntil: '2028-05-05'
      },
      Nationalities: ['LT'],
      IdDocuments: [
        {
          Id: 'DOC-301',
          Number: '87654321',
          TypeCode: 'IDENTITY_CARD',
          IssuerCountryCode: 'LT',
          IssueDate: '2022-01-10',
          ExpirationDate: '2032-01-10',
          FormpipeFileId: 'FP-301',
          NationalIdentifier: {
            Type: 'PERSONAL_CODE',
            Value: '37905050005',
            CountryCode: 'LT'
          }
        }
      ],
      OndatoCheckValid: true,
      AmlScreening: {
        LastAmlResultDate: '2026-02-01T08:00:00.000Z',
        AmlResult: 'PASSED',
        SmaApprovalStatus: 'APPROVED',
        SmaDecisionDate: '2026-02-01T08:00:00.000Z'
      },
      Kyc: {
        IsKycRequired: false,
        ExpirationDate: '2028-01-01'
      },
      Status: 'Existing'
    }]
  ],

  accumulatedJuridicalPersons: [
    ['A4001', {
      McdId: 'A4001',
      FullName: 'UAB Naujas Startas',
      CompanyCode: 'EST-998877',
      CountryCode: 'LT',
      Status: 'Prospect',
      TransactId: 'TX-ACC-001',
      RepresentativeMcdId: 'R3001',
      phoneNumber: '+37067711223',
      secondaryPhoneNumber: '+37052998877',
      registrationAddress: {
        countryCode: 'LT',
        buildingNumber: '1',
        flatNumber: '1',
        postCode: 'LT-01001',
        city: 'Vilnius',
        street: 'Pilies g.',
        fullAddress: 'Pilies g. 1-1, LT-01001 Vilnius'
      },
      selectedProducts: [
        { ProductCategory: 'ACCUMULATED_ACCOUNT', ProductId: 'ESTABLISHING_CAPITAL_ACCOUNT' }
      ]
    }]
  ]
};

// Database container
export const db = {
  physicalPersons: new Map(initialSeedData.physicalPersons),
  juridicalPersons: new Map(initialSeedData.juridicalPersons),
  representatives: new Map(initialSeedData.representatives),
  accumulatedJuridicalPersons: new Map(initialSeedData.accumulatedJuridicalPersons)
};

// Map collection aliases
export function getCollection(name) {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n === 'physical' || n === 'physicalpersons') return db.physicalPersons;
  if (n === 'juridical' || n === 'juridicalpersons') return db.juridicalPersons;
  if (n === 'representatives' || n === 'representative') return db.representatives;
  if (n === 'accumulated' || n === 'accumulatedjuridicalpersons') return db.accumulatedJuridicalPersons;
  return null;
}

// Helper: look up physical person with fallback for legacy IDs
export function getPhysicalPerson(id) {
  if (!id) return null;
  let p = db.physicalPersons.get(id);
  if (!p) {
    if (id === 'P1001') p = db.physicalPersons.get('F20014528');
    else if (id === 'P1002') p = db.physicalPersons.get('F20014529');
    else if (id === 'P1003') p = db.physicalPersons.get('F20014530');
    else if (id === 'P1004') p = db.physicalPersons.get('F20014531');
    else if (id === 'P1005') p = db.physicalPersons.get('F20014532');
  }
  return p;
}

// Helper: look up juridical person with fallback for legacy IDs
export function getJuridicalPerson(id) {
  if (!id) return null;
  let j = db.juridicalPersons.get(id);
  if (!j && id === 'J2001') {
    j = db.juridicalPersons.get('J20014528');
  }
  return j;
}

// Sequence counters (8 digits)
export let physicalSeq = 20014533;
export let juridicalSeq = 20014529;
export let repSeq = 3002;
export let accSeq = 4002;

export function recalculateSequenceCounters() {
  for (const key of db.physicalPersons.keys()) {
    const num = parseInt(String(key).replace(/\D/g, ''), 10);
    if (!isNaN(num) && num >= physicalSeq) physicalSeq = num + 1;
  }
  for (const key of db.juridicalPersons.keys()) {
    const num = parseInt(String(key).replace(/\D/g, ''), 10);
    if (!isNaN(num) && num >= juridicalSeq) juridicalSeq = num + 1;
  }
  for (const key of db.representatives.keys()) {
    const num = parseInt(String(key).replace(/\D/g, ''), 10);
    if (!isNaN(num) && num >= repSeq) repSeq = num + 1;
  }
  for (const key of db.accumulatedJuridicalPersons.keys()) {
    const num = parseInt(String(key).replace(/\D/g, ''), 10);
    if (!isNaN(num) && num >= accSeq) accSeq = num + 1;
  }
}

// Generate physical person MCD ID: 'F' followed by 8 numbers (e.g. F20014528)
export function generatePhysicalMcdId() {
  const seq = physicalSeq++;
  return 'F' + String(seq).padStart(8, '0');
}

// Generate juridical person MCD ID: 'J' followed by 8 numbers (e.g. J20014528)
export function generateJuridicalMcdId() {
  const seq = juridicalSeq++;
  return 'J' + String(seq).padStart(8, '0');
}

// Sync database to db.json file atomically and update backup
export function syncDbToFile() {
  try {
    const serialized = {
      _lastUpdated: new Date().toISOString(),
      physicalPersons: Array.from(db.physicalPersons.entries()),
      juridicalPersons: Array.from(db.juridicalPersons.entries()),
      representatives: Array.from(db.representatives.entries()),
      accumulatedJuridicalPersons: Array.from(db.accumulatedJuridicalPersons.entries())
    };
    const jsonStr = JSON.stringify(serialized, null, 2);
    // Write atomically via tmp file to prevent zero-byte or corrupt files on unexpected shutdown
    const tmpPath = DB_FILE_PATH + '.tmp';
    fs.writeFileSync(tmpPath, jsonStr, 'utf-8');
    fs.renameSync(tmpPath, DB_FILE_PATH);
    fs.writeFileSync(DB_BACKUP_PATH, jsonStr, 'utf-8');
  } catch (err) {
    console.error('Failed to sync db to file:', err.message);
  }
}

// Load database from db.json or fallback backup
export function loadDbFromFile() {
  let fileToLoad = null;
  if (fs.existsSync(DB_FILE_PATH)) {
    try {
      const stats = fs.statSync(DB_FILE_PATH);
      if (stats.size > 20) fileToLoad = DB_FILE_PATH;
    } catch (e) {}
  }
  if (!fileToLoad && fs.existsSync(DB_BACKUP_PATH)) {
    try {
      const stats = fs.statSync(DB_BACKUP_PATH);
      if (stats.size > 20) fileToLoad = DB_BACKUP_PATH;
    } catch (e) {}
  }

  if (fileToLoad) {
    try {
      const content = JSON.parse(fs.readFileSync(fileToLoad, 'utf-8'));
      if (content.physicalPersons && Array.isArray(content.physicalPersons) && content.physicalPersons.length > 0) {
        db.physicalPersons = new Map(content.physicalPersons);
      }
      if (content.juridicalPersons && Array.isArray(content.juridicalPersons) && content.juridicalPersons.length > 0) {
        db.juridicalPersons = new Map(content.juridicalPersons);
      }
      if (content.representatives && Array.isArray(content.representatives) && content.representatives.length > 0) {
        db.representatives = new Map(content.representatives);
      }
      if (content.accumulatedJuridicalPersons && Array.isArray(content.accumulatedJuridicalPersons) && content.accumulatedJuridicalPersons.length > 0) {
        db.accumulatedJuridicalPersons = new Map(content.accumulatedJuridicalPersons);
      }
      console.log(`Loaded database state from ${path.basename(fileToLoad)} (${db.physicalPersons.size} physical persons)`);
    } catch (err) {
      console.error('Error reading database file, using defaults:', err.message);
    }
  } else {
    syncDbToFile();
  }
  recalculateSequenceCounters();
}

// Initial load from disk
loadDbFromFile();

// Graceful process exit handlers to ensure data is always flushed to disk
process.on('SIGINT', () => {
  try { syncDbToFile(); } catch (e) {}
  process.exit(0);
});

process.on('SIGTERM', () => {
  try { syncDbToFile(); } catch (e) {}
  process.exit(0);
});

process.on('beforeExit', () => {
  try { syncDbToFile(); } catch (e) {}
});

// Helper: Convert first letter of key to lowercase (camelCase)
export function lowerFirstKey(key) {
  if (typeof key !== 'string' || key.length === 0) return key;
  if (key === 'TransactID' || key === 'TransactId') return 'transactID';
  if (key === 'McdId') return 'mcdId';
  return key.charAt(0).toLowerCase() + key.slice(1);
}

export function lowerFirstKeys(obj) {
  if (obj === null || typeof obj !== 'object' || obj instanceof Date || (typeof Buffer !== 'undefined' && Buffer.isBuffer(obj))) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(lowerFirstKeys);
  }
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = lowerFirstKey(key);
    result[newKey] = lowerFirstKeys(value);
  }
  return result;
}

// Helper: send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept'
  });
  const payload = (data === openapiSpec) ? data : lowerFirstKeys(data);
  res.end(JSON.stringify(payload, null, 2));
}

// Helper: send HTML response
function sendHtml(res, statusCode, html) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(html);
}

// Helper: parse JSON request body
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(new Error('Invalid JSON payload: ' + err.message));
      }
    });
    req.on('error', reject);
  });
}

// Full DB snapshot in plain JSON object
export function getDbSnapshot() {
  return {
    _meta: {
      service: 'MCD Infinity API Server',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      counts: {
        physicalPersons: db.physicalPersons.size,
        juridicalPersons: db.juridicalPersons.size,
        representatives: db.representatives.size,
        accumulatedJuridicalPersons: db.accumulatedJuridicalPersons.size
      }
    },
    physicalPersons: Array.from(db.physicalPersons.values()),
    juridicalPersons: Array.from(db.juridicalPersons.values()),
    representatives: Array.from(db.representatives.values()),
    accumulatedJuridicalPersons: Array.from(db.accumulatedJuridicalPersons.values())
  };
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// Transact Core Banking API Integration
// -------------------------------------------------------------
export const DEFAULT_TRANSACT_API_URL = process.env.TRANSACT_API_URL || 'http://192.168.1.157:8085/irf-provider-container/api/v5.1.0/party/customers';
export const DEFAULT_TRANSACT_COOKIE = process.env.TRANSACT_COOKIE || 'ApplicationGatewayAffinity=169ff9c6fbc8876c0b34e7b7497e23fe;ApplicationGatewayAffinityCORS=169ff9c6fbc8876c0b34e7b7497e23fe';
export const DEFAULT_TRANSACT_TOKEN = process.env.TRANSACT_BEARER_TOKEN || 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJWS3lBcGswWExyeC0zQUZUWVBzX1dNOG55SXN1YUFiNFVRbGhmM0VrM2ZBIn0.eyJleHAiOjE3OTA3Njk5OTUsImlhdCI6MTc5MDc2NzI5NSwianRpIjoiZTljZjY5MGItOGIwMi00ZDEzLThjNzItZmE5ZjM0NDkxYjI4IiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1waWkuemVucHIubm9ucHJvZC50ZW1lbm9zYmFua2luZy5jbG91ZC9hdXRoL3JlYWxtcy9iYW5raW5nY2xvdWQiLCJhdWQiOlsibW5vZ3ctVGRoRGVzaWduZXIiLCJtbm9ndy1zcG90bGlnaHQiLCJyZWFsbS1tYW5hZ2VtZW50IiwibW5vZ3ctVGRoU2NoZWR1bGVyIiwidGVtZW5vcy1ncmFmYW5hLWNsaWVudCIsIm1ub2d3LVRkaHNxbGF1dGgiLCJtbm9ndy1UZGhUTVMiLCJtbm9ndy1UZGhSaXNrU2VydmljZXMiLCJtbm9ndy1UZGhBZG1pbmlzdHJhdG9yIiwiYWNjb3VudCJdLCJzdWIiOiIwZWZlOGE2My01NDQ3LTRlMmYtOTE3My1jZDA0OTYzMDZhMWMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJtbm9ndy10cmFuc2FjdCIsInNlc3Npb25fc3RhdGUiOiI4NDBiMmVmOS04MjU1LTRmOGUtOGYyMi0zZDM0Njg3NWU0YTYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vYmFua2FzLWRldi56ZW5wci5ub25wcm9kLnRlbWVub3NiYW5raW5nLmNsb3VkIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJyZWxlYXNlX21hbmFnZXIiLCJvZmZsaW5lX2FjY2VzcyIsInJlc3QtYWxsIiwiQWRtaW5pc3RyYXRvcnMiLCJhZG1pbiIsImRlZmF1bHQtcm9sZXMtYmFua2luZ2Nsb3VkIiwiZGV2ZWxvcGVyIiwidW1hX2F1dGhvcml6YXRpb24iLCJraWUtc2VydmVyIiwiVFBNQWRtaW5pc3RyYXRvciJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Im1ub2d3LVRkaERlc2lnbmVyIjp7InJvbGVzIjpbIlRkaERlc2lnbmVyVXNlciIsIlRkaERlc2lnbmVyUmVhZE9ubHkiXX0sIm1ub2d3LXNwb3RsaWdodCI6eyJyb2xlcyI6WyJHQl9DdXN0b21lclNlcnZpY2VBZ2VudCIsIkdCX1N1cGVydmlzb3IiLCJTdXBlciBBZG1pbiJdfSwicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJtYW5hZ2UtdXNlcnMiLCJ2aWV3LXVzZXJzIiwicXVlcnktdXNlcnMiLCJxdWVyeS11c2VycyJdfSwibW5vZ3ctVGRoU2NoZWR1bGVyIjp7InJvbGVzIjpbIlRkaFNjaGVkdWxlclVzZXIiLCJUZGhTY2hlZHVsZXJSZWFkT25seSJdfSwidGVtZW5vcy1ncmFmYW5hLWNsaWVudCI6eyJyb2xlcyI6WyJ2aWV3ZXIiXX0sIm1ub2d3LVRkaHNxbGF1dGgiOnsicm9sZXMiOlsiVGRoU3FsYXV0aFVzZXIiXX0sIm1ub2d3LVRkaFRNUyI6eyJyb2xlcyI6WyJUZGhUbXNVc2VyIl19LCJtbm9ndy1UZGhSaXNrU2VydmljZXMiOnsicm9sZXMiOlsiVGRoUmlza1NlcnZpY2VzVXNlciJdfSwibW5vZ3ctVGRoQWRtaW5pc3RyYXRvciI6eyJyb2xlcyI6WyJUZGhBZG1pblVzZXIiLCJUZGhBZG1pblJlYWRPbmx5Il19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwic2lkIjoiODQwYjJlZjktODI1NS00ZjhlLThmMjItM2QzNDY4NzVlNGE2IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInJvbGVJZCI6IkFETUlOIiwibmFtZSI6IlRSQU5TQUNUIFNBQVMiLCJTcWxUZGhVc2VyQ2xhaW1OYW1lIjoiU3FsVGRoVXNlckNsYWltTmFtZSIsInQyNHVzZXIiOiJtbm9ndy1zYWFzdXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6Im1ub2d3LXNhYXN1c2VyIiwiZ2l2ZW5fbmFtZSI6IlRSQU5TQUNUIiwiZmFtaWx5X25hbWUiOiJTQUFTIiwiZW1haWwiOiJtbm9ndy1zYWFzdXNlckB0cmFuc2FjdC5jb20ifQ.fnrA990Zbh4YIdCm74hX1XcUZIf6nno1qzvZSMaZyuaCR-Ciq4tg4cWxwVG1OOnj9tuVHOtqI13JrnLT_X6anGcwM0dDAg9QikXXN4Oteeo8IR_j1u93eHbEUmWIbwV8Evm3IQCeYkiWXIU4q9_cZxyVpu3X1AsKYrb-WPhtzo01hwLAWzrVqqKo01Glt_LS9GqE0bXQuczew5cuDuqb5L80L150NZSHzrkNOZjRj27iZ0YuwSM4MzB2HJ-hLQutJcXihCnKXdhYDJzitsYgdu8hgL_VUNp77eEay9CW0CoiJt7fSkXgC06YYAQzdq4KY12d47t-Iwz542TVsUqFEg';

export function toSwiftSafeString(str, allowSpecial = '') {
  if (!str) return '';
  const regex = new RegExp('[^a-zA-Z0-9 .,/\'-' + allowSpecial + ']', 'g');
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(regex, '')
    .trim();
}

// Incremental & random series generator for Transact customerMnemonic (e.g. XD005, XD10145)
let mnemonicCounter = 100;
export function generateCustomerMnemonic(prefix = 'XD') {
  mnemonicCounter++;
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `${prefix}${mnemonicCounter}${randomSuffix}`.slice(0, 10);
}

// Generate a valid-format random 9-digit Social Security Number (XXX-XX-XXXX)
export function generateRandomSsn() {
  const area = String(Math.floor(100 + Math.random() * 899));
  const group = String(Math.floor(10 + Math.random() * 89));
  const serial = String(Math.floor(1000 + Math.random() * 8999));
  return `${area}-${group}-${serial}`;
}

// Robust phone parser that accurately separates IDD international dial prefix and local phone number
export function parsePhoneNumber(rawPhone, defaultCountry = 'LT') {
  if (!rawPhone) {
    return defaultCountry === 'PK'
      ? { idd: '+92', contactData: '3350221182', fullPhone: '+923350221182' }
      : { idd: '+370', contactData: '60012345', fullPhone: '+37060012345' };
  }
  const s = String(rawPhone).trim();
  if (s.startsWith('+')) {
    // Match common dial codes: +370, +371, +372, +92, +44, +49, +33, +48, +1, or general 1-3 digits
    const match = s.match(/^(\+(?:37[012]|92|44|49|33|48|1|\d{1,3}))[\s.-]?(\d+)$/);
    if (match) {
      return { idd: match[1], contactData: match[2], fullPhone: match[1] + match[2] };
    }
    const idd = s.slice(0, 4);
    const num = s.slice(4).replace(/\D/g, '') || '60012345';
    return { idd, contactData: num, fullPhone: idd + num };
  }
  const digits = s.replace(/\D/g, '');
  if (/^03\d{9}$/.test(digits)) {
    return { idd: '+92', contactData: digits.slice(1), fullPhone: '+92' + digits.slice(1) };
  }
  if (/^(?:86|06)\d{7}$/.test(digits)) {
    return { idd: '+370', contactData: digits.slice(1), fullPhone: '+370' + digits.slice(1) };
  }
  if (digits.length >= 8 && digits.startsWith('92')) {
    return { idd: '+92', contactData: digits.slice(2), fullPhone: '+' + digits };
  }
  if (digits.length >= 8 && digits.startsWith('370')) {
    return { idd: '+370', contactData: digits.slice(3), fullPhone: '+' + digits };
  }
  const fallbackIdd = defaultCountry === 'PK' ? '+92' : '+370';
  return { idd: fallbackIdd, contactData: digits || '60012345', fullPhone: fallbackIdd + (digits || '60012345') };
}

// Robust DOB extractor and normalizer (YYYY-MM-DD), with Lithuanian PersonalCode fallback
export function parseDateOfBirth(customer) {
  const rawDob = customer.DateOfBirth || customer.dateOfBirth || customer.dob || customer.birthDate;
  if (rawDob) {
    const str = String(rawDob).split('T')[0].trim().replace(/\//g, '-');
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  }
  const code = String(customer.PersonalCode || customer.personalCode || '').trim();
  if (/^[1-6]\d{10}$/.test(code)) {
    const g = parseInt(code[0], 10);
    let century = 1900;
    if (g === 1 || g === 2) century = 1800;
    else if (g === 3 || g === 4) century = 1900;
    else if (g === 5 || g === 6) century = 2000;
    const yy = code.slice(1, 3);
    const mm = code.slice(3, 5);
    const dd = code.slice(5, 7);
    const year = century + parseInt(yy, 10);
    return `${year}-${mm}-${dd}`;
  }
  return '1990-01-01';
}

export function buildTransactPayload(customer, overrides = {}) {
  // 1. Names
  let rawFirst = customer.FirstName || customer.firstName || '';
  let rawLast = customer.LastName || customer.lastName || '';
  if (!rawFirst && !rawLast && (customer.FullName || customer.fullName)) {
    const parts = String(customer.FullName || customer.fullName).trim().split(/\s+/);
    rawFirst = parts[0] || 'Customer';
    rawLast = parts.slice(1).join(' ') || 'User';
  }
  if (customer.MiddleName || customer.middleName) {
    rawFirst = `${rawFirst} ${customer.MiddleName || customer.middleName}`.trim();
  }
  const givenName = toSwiftSafeString(rawFirst) || 'Customer';
  const lastName = toSwiftSafeString(rawLast) || 'User';
  const fullName = `${givenName} ${lastName}`.trim();

  // 2. Transact customerMnemonic (XD series)
  const mnemonic = overrides.customerMnemonic || generateCustomerMnemonic('XD');

  // 3. Date of birth
  const dob = parseDateOfBirth(customer);

  // 4. Country & Address
  const addr = customer.RegistrationAddress || customer.registrationAddress || customer.Address || customer.address || {};
  const country = String(customer.CountryCode || customer.countryCode || addr.countryCode || 'LT').toUpperCase();
  const street = toSwiftSafeString(addr.fullAddress || addr.street || addr.addressLine1 || 'Gedimino pr. 12-4');
  const city = toSwiftSafeString(addr.city || addr.town || 'Vilnius');
  const postCode = parseInt(String(addr.postCode || addr.postalCode || '75350').replace(/\D/g, ''), 10) || 75350;

  // 5. Phone numbers
  const rawPhone = customer.PrimaryPhoneNumber || customer.primaryPhoneNumber || customer.phoneNumber || customer.phone || customer.mobile || customer.officePhoneNumber;
  const parsedPhone = parsePhoneNumber(rawPhone, country);

  // 6. Email
  const rawEmail = customer.PrimaryEmail || customer.primaryEmail || customer.email || customer.mail || customer.Email;
  const cleanEmail = rawEmail ? String(rawEmail).trim() : `${givenName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

  // 7. SSN / Tax ID (Random SSN format XXX-XX-XXXX if not explicitly provided)
  const ssn = String(customer.Ssn || customer.ssn || customer.TaxId || customer.taxId || overrides.ssn || overrides.taxId || generateRandomSsn()).trim();

  // 8. Gender & Title
  const gender = (customer.Gender || customer.gender || '').toUpperCase() === 'FEMALE' ? 'FEMALE' : 'MALE';
  const title = customer.Title || customer.title || (gender === 'FEMALE' ? 'MS' : 'MR');

  // 9. Customer ID references from MCD
  const mcdCustomerId = String(customer.McdId || customer.mcdId || '').trim();
  const personalCode = String(customer.PersonalCode || customer.personalCode || '').trim();

  return {
    body: {
      displayNames: [{ displayName: fullName }],
      customerNames: [{ customerName: givenName, customerNameAdditional: lastName }],
      faxIds: [{ faxId: 'FAX001' }],
      officePhoneNumbers: [{ officePhoneNumber: parsedPhone.fullPhone }],
      streets: [{ street }],
      addressCities: [{ addressCity: city }],
      countries: [{ country }],
      otherNationalityIds: [{ otherNationalityId: country }],
      postingRestrictIds: [{ postingRestrictId: 1 }],
      taxIds: [{ taxId: ssn }],
      contactDetails: [
        { contactType: 'MOBILE', iddPrefixPhone: parsedPhone.idd, contactData: parsedPhone.contactData },
        { contactType: 'EMAIL', iddPrefixPhone: '', contactData: cleanEmail }
      ],
      language: 1,
      dateOfBirth: dob,
      customerStatus: '17',
      customerMnemonic: mnemonic,
      nationalityId: country,
      residenceId: country,
      accountOfficerId: 1,
      target: 1,
      sectorId: 1001,
      gender: gender,
      maritalStatus: 'MARRIED',
      industryId: '13',
      postCode,
      introducer: 'DIGITALONBOARDING',
      kycNextSystemReviewDate: '2027-01-15',
      kycNextReviewDate: '2027-01-15',
      amlLastResultDate: '2026-09-08',
      title: title,
      isSecureMessage: 'YES',
      lastName,
      givenName,
      birthIncorpDate: dob,
      domicile: country,
      manualRiskClass: '',
      overrideReason: '',
      numberOfDependents: customer.numberOfDependents !== undefined ? customer.numberOfDependents : 2,
      dateOfDeath: '',
      extensions: {
        sourceSystem: 'INFINITY',
        channel: 'OLB',
        customerSegment: 'RETAIL',
        externalCustomerId: mcdCustomerId,
        mcdCustomerId: mcdCustomerId,
        personalCode: personalCode,
        socialSecurityNumber: ssn
      },
      ...overrides
    }
  };
}

export function hasTransactId(customer) {
  if (!customer) return false;
  const tid = customer.TransactID || customer.TransactId;
  if (!tid) return false;
  const s = String(tid).trim();
  return s !== '' && s !== 'null' && s !== 'undefined' && s !== 'None' && s !== 'Pending';
}

export async function syncCustomerWithTransact(personalCode, options = {}) {
  if (!personalCode) {
    const error = new Error('PersonalCode is required.');
    error.statusCode = 400;
    error.code = 'MISSING_PERSONAL_CODE';
    throw error;
  }

  // 1. Locate physical person in MCD database
  let targetKey = null;
  let customer = null;
  for (const [key, p] of db.physicalPersons.entries()) {
    if (String(p.PersonalCode).trim() === String(personalCode).trim()) {
      customer = p;
      targetKey = key;
      break;
    }
  }

  if (!customer) {
    const error = new Error(`Physical person with PersonalCode '${personalCode}' was not found in MCD database.`);
    error.statusCode = 404;
    error.code = 'CUSTOMER_NOT_FOUND';
    throw error;
  }

  // If customer already has TransactID, do not call Transact API
  if (hasTransactId(customer) && !options.force) {
    const existingId = String(customer.TransactID || customer.TransactId);
    return {
      success: true,
      alreadySynced: true,
      message: `Customer ${customer.McdId} (${customer.FirstName} ${customer.LastName}) already has TransactID '${existingId}'. No new Transact customer was created.`,
      personalCode: String(personalCode),
      mcdId: customer.McdId,
      transactId: existingId,
      customer
    };
  }

  // 2. Build Transact payload
  const transactPayload = buildTransactPayload(customer, options.overrides || {});
  const transactUrl = options.url || DEFAULT_TRANSACT_API_URL;
  const transactToken = options.token || DEFAULT_TRANSACT_TOKEN;
  const transactCookie = options.cookie || DEFAULT_TRANSACT_COOKIE;

  // Support offline mock mode if specifically requested
  if (options.mock === true || process.env.MOCK_TRANSACT === 'true') {
    const mockId = String(Math.floor(10001000 + Math.random() * 9000));
    customer.TransactID = mockId;
    customer.TransactId = mockId;
    customer.TransactSyncDate = new Date().toISOString();
    customer.TransactStatus = 'Synced (Mock)';
    db.physicalPersons.set(targetKey, customer);
    syncDbToFile();
    return {
      success: true,
      message: `[MOCK] Customer ${customer.McdId} (PersonalCode: ${personalCode}) synced with Transact. TransactID updated to ${mockId}.`,
      personalCode: String(personalCode),
      mcdId: customer.McdId,
      transactId: mockId,
      customer,
      transactResponse: { header: { id: mockId, status: 'success', mock: true } }
    };
  }

  // 3. Make HTTP request to Transact system
  let response;
  let resData;
  try {
    response = await fetch(transactUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': transactCookie,
        'Authorization': `Bearer ${transactToken}`
      },
      body: JSON.stringify(transactPayload),
      signal: AbortSignal.timeout(options.timeout || 15000)
    });
    resData = await response.json();
  } catch (netErr) {
    const error = new Error(`Connection to Transact API failed (${transactUrl}): ${netErr.message}`);
    error.statusCode = 502;
    error.code = 'TRANSACT_CONNECTION_ERROR';
    error.details = netErr.message;
    throw error;
  }

  // 4. Validate Transact response
  const isSuccess = response.ok && (
    resData.header?.status === 'success' ||
    (resData.header?.id && !resData.error) ||
    resData.id
  );

  const transactId = resData.header?.id || resData.id || resData.body?.id || resData.header?.transactionId;

  if (!isSuccess || !transactId) {
    const error = new Error(`Transact API returned error: ${JSON.stringify(resData.error || resData)}`);
    error.statusCode = response.status >= 400 ? response.status : 502;
    error.code = 'TRANSACT_REJECTED';
    error.transactResponse = resData;
    error.transactPayload = transactPayload;
    throw error;
  }

  // 5. Update MCD customer in database
  customer.TransactID = String(transactId);
  customer.TransactId = String(transactId);
  customer.TransactSyncDate = new Date().toISOString();
  customer.TransactStatus = 'Synced';
  customer.transactResponse = resData;
  db.physicalPersons.set(targetKey, customer);
  syncDbToFile();

  return {
    success: true,
    message: `Customer ${customer.McdId} (PersonalCode: ${personalCode}) successfully synced with Transact. TransactID updated to ${transactId}.`,
    personalCode: String(personalCode),
    mcdId: customer.McdId,
    transactId: String(transactId),
    customer,
    transactResponse: resData
  };
}

// Request Routing Engine
// -------------------------------------------------------------
export async function handleRequest(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();
  const query = Object.fromEntries(parsedUrl.searchParams.entries());

  try {
    // ---------------------------------------------------------
    // Health, Spec, & Database Admin Endpoints
    // ---------------------------------------------------------
    if (method === 'GET' && pathname === '/health') {
      return sendJson(res, 200, {
        status: 'ok',
        service: 'MCD Infinity API Server',
        version: '1.0.0',
        uptime: process.uptime(),
        database: {
          physicalPersons: db.physicalPersons.size,
          juridicalPersons: db.juridicalPersons.size,
          representatives: db.representatives.size,
          accumulatedAccounts: db.accumulatedJuridicalPersons.size
        }
      });
    }

    if (method === 'GET' && (pathname === '/admin/db' || pathname === '/api/db')) {
      return sendJson(res, 200, getDbSnapshot());
    }

    // ---------------------------------------------------------
    // Formpipe LaserNet Document Adapter Endpoints
    // ---------------------------------------------------------

    // 1. Generate Document: POST /formpipe-adapter/v1/document-generation/generate
    if (method === 'POST' && pathname === '/formpipe-adapter/v1/document-generation/generate') {
      await parseBody(req);
      const docId = '64424517880';
      const dmLink = `https://adapter-dev.artea.lasernetgroup.cloud/formpipe-adapter/v1/documents/by-id/${docId}`;
      const responseData = {
        status: "200",
        DocID: docId,
        DMLink: dmLink,
        message: "OK"
      };
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, AccessKey'
      });
      return res.end(JSON.stringify(responseData, null, 2));
    }

    // 2. Generate Document Only (raw PDF byte array): POST /formpipe-adapter/v1/document-generation/documentonly
    if (method === 'POST' && pathname === '/formpipe-adapter/v1/document-generation/documentonly') {
      await parseBody(req);
      if (!formpipePdfBuffer && fs.existsSync(FORMPIPE_PDF_PATH)) {
        formpipePdfBuffer = fs.readFileSync(FORMPIPE_PDF_PATH);
        formpipePdfBase64 = formpipePdfBuffer.toString('base64');
      }

      if (query.format === 'base64') {
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, AccessKey'
        });
        return res.end(formpipePdfBase64);
      }

      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="document.pdf"',
        'Content-Length': formpipePdfBuffer ? formpipePdfBuffer.length : 0,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, AccessKey'
      });
      return res.end(formpipePdfBuffer || Buffer.from(''));
    }

    // 3. Get Document File by ID (Base64 / PDF): GET /formpipe-adapter/v1/documents/by-id/:id/file
    const formpipeFileMatch = pathname.match(/^\/formpipe-adapter\/v1\/documents\/by-id\/([^\/]+)\/file$/);
    if (method === 'GET' && formpipeFileMatch) {
      const docId = formpipeFileMatch[1];
      if (!formpipePdfBuffer && fs.existsSync(FORMPIPE_PDF_PATH)) {
        formpipePdfBuffer = fs.readFileSync(FORMPIPE_PDF_PATH);
        formpipePdfBase64 = formpipePdfBuffer.toString('base64');
      }

      if (query.format === 'pdf' || query.format === 'binary' || query.download === 'true' || req.headers['accept'] === 'application/pdf') {
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="document-${docId}.pdf"`,
          'Content-Length': formpipePdfBuffer ? formpipePdfBuffer.length : 0,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, AccessKey'
        });
        return res.end(formpipePdfBuffer || Buffer.from(''));
      }

      if (query.format === 'json' || req.headers['accept'] === 'application/json') {
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, AccessKey'
        });
        return res.end(JSON.stringify({
          status: "200",
          DocID: docId,
          message: "OK",
          file: formpipePdfBase64
        }, null, 2));
      }

      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, AccessKey'
      });
      return res.end(formpipePdfBase64);
    }

    // Document Metadata: GET /formpipe-adapter/v1/documents/by-id/:id
    const formpipeDocMatch = pathname.match(/^\/formpipe-adapter\/v1\/documents\/by-id\/([^\/]+)$/);
    if (method === 'GET' && formpipeDocMatch) {
      const docId = formpipeDocMatch[1];
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, AccessKey'
      });
      return res.end(JSON.stringify({
        status: "200",
        DocID: docId,
        DMLink: `https://adapter-dev.artea.lasernetgroup.cloud/formpipe-adapter/v1/documents/by-id/${docId}`,
        fileUrl: `/formpipe-adapter/v1/documents/by-id/${docId}/file`,
        message: "OK"
      }, null, 2));
    }

    // Direct Browser Update endpoint: PUT /admin/db/:collection/:id
    let dbMatch = pathname.match(/^\/admin\/db\/([^\/]+)\/([^\/]+)$/);
    if (method === 'PUT' && dbMatch) {
      const [, colName, id] = dbMatch;
      const targetMap = getCollection(colName);
      if (!targetMap) {
        return sendJson(res, 400, { success: false, ErrorMessage: `Unknown collection '${colName}'` });
      }

      const body = await parseBody(req);
      const existing = targetMap.get(id);
      if (!existing) {
        return sendJson(res, 404, { success: false, ErrorMessage: `Record '${id}' not found in '${colName}'` });
      }

      // Merge and update
      const updated = { ...existing, ...body, McdId: id };
      targetMap.set(id, updated);
      syncDbToFile();

      return sendJson(res, 200, {
        success: true,
        message: `Record ${id} updated in ${colName} successfully`,
        record: updated
      });
    }

    // Direct Browser Delete endpoint: DELETE /admin/db/:collection/:id
    if (method === 'DELETE' && dbMatch) {
      const [, colName, id] = dbMatch;
      const targetMap = getCollection(colName);
      if (!targetMap) {
        return sendJson(res, 400, { success: false, ErrorMessage: `Unknown collection '${colName}'` });
      }

      if (!targetMap.has(id)) {
        return sendJson(res, 404, { success: false, ErrorMessage: `Record '${id}' not found in '${colName}'` });
      }

      targetMap.delete(id);
      syncDbToFile();

      return sendJson(res, 200, {
        success: true,
        message: `Record ${id} deleted from ${colName} successfully`
      });
    }

    // Direct Browser Add endpoint: POST /admin/db/:collection
    dbMatch = pathname.match(/^\/admin\/db\/([^\/]+)$/);
    if (method === 'POST' && dbMatch && dbMatch[1] !== 'reset') {
      const colName = dbMatch[1];
      const targetMap = getCollection(colName);
      if (!targetMap) {
        return sendJson(res, 400, { success: false, ErrorMessage: `Unknown collection '${colName}'` });
      }

      const body = await parseBody(req);
      let id = body.McdId || body.mcdId;
      if (!id) {
        if (colName.startsWith('p')) {
          id = generatePhysicalMcdId();
        } else if (colName.startsWith('j')) {
          id = generateJuridicalMcdId();
        } else if (colName.startsWith('r')) {
          id = 'R' + (repSeq++);
        } else {
          id = 'A' + (accSeq++);
        }
      }
      const record = { ...body, McdId: id, mcdId: id };

      targetMap.set(id, record);
      syncDbToFile();

      // If adding a physical person with a personalCode, automatically sync with Transact
      if (colName === 'physical' && (record.PersonalCode || record.personalCode)) {
        const code = record.PersonalCode || record.personalCode;
        record.PersonalCode = code;
        try {
          const syncRes = await syncCustomerWithTransact(code, {
            mock: Boolean(body.mock || req.headers['x-mock-transact'] === 'true' || process.env.MOCK_TRANSACT === 'true')
          });
          if (syncRes && syncRes.transactId) {
            record.TransactID = String(syncRes.transactId);
            record.TransactId = String(syncRes.transactId);
            record.TransactSyncDate = syncRes.customer.TransactSyncDate;
            record.TransactStatus = 'Synced';
            record.transactResponse = syncRes.transactResponse;
            targetMap.set(id, record);
            syncDbToFile();
          }
        } catch (syncErr) {
          console.warn(`[POST /admin/db/physical] Transact sync notice: ${syncErr.message}`);
          record.TransactStatus = 'Sync Failed';
          record.TransactError = syncErr.message;
          targetMap.set(id, record);
          syncDbToFile();
        }
      }

      return sendJson(res, 201, {
        success: true,
        message: `Record ${id} created in ${colName} successfully`,
        record
      });
    }

    if (method === 'POST' && pathname === '/admin/db/reset') {
      db.physicalPersons = new Map(initialSeedData.physicalPersons);
      db.juridicalPersons = new Map(initialSeedData.juridicalPersons);
      db.representatives = new Map(initialSeedData.representatives);
      db.accumulatedJuridicalPersons = new Map(initialSeedData.accumulatedJuridicalPersons);
      syncDbToFile();
      return sendJson(res, 200, { success: true, message: 'Database reset to default seed data', snapshot: getDbSnapshot() });
    }

    if (method === 'GET' && pathname === '/openapi.json') {
      return sendJson(res, 200, openapiSpec);
    }

    // Swagger UI docs
    if (method === 'GET' && (pathname === '/docs' || pathname === '/swagger')) {
      const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MCD Infinity API - Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  <link rel="icon" type="image/png" href="https://assets.apidog.com/app/project-icon/builtin/15.jpg" />
  <style>
    html { box-sizing: border-box; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .topbar-wrapper img { content: url('https://assets.apidog.com/app/project-icon/builtin/15.jpg'); height: 35px; border-radius: 4px; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: "/openapi.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;
      return sendHtml(res, 200, swaggerHtml);
    }

    // Interactive Dashboard & API Explorer with Live Database Viewer & Editor
    if (method === 'GET' && pathname === '/') {
      return sendHtml(res, 200, renderDashboardHtml());
    }

    // ---------------------------------------------------------
    
    // ---------------------------------------------------------
    // Transact Core Banking Customer Sync Endpoints
    // ---------------------------------------------------------
    if (method === 'POST' && (
      pathname === '/transact/sync-customer' ||
      pathname === '/persons/physical/sync-transact' ||
      pathname === '/api/transact/sync' ||
      pathname.match(/^\/persons\/physical\/by-personal-code\/([^\/]+)\/sync-transact$/)
    )) {
      const body = await parseBody(req);
      const pathMatch = pathname.match(/^\/persons\/physical\/by-personal-code\/([^\/]+)\/sync-transact$/);
      const personalCode = (pathMatch && decodeURIComponent(pathMatch[1])) || body.personalCode || body.PersonalCode || query.personalCode || query.PersonalCode;

      if (!personalCode) {
        return sendJson(res, 400, {
          success: false,
          error: 'MISSING_PERSONAL_CODE',
          message: 'personalCode is required in JSON body (e.g. { "personalCode": "38501010001" }) or URL parameter.'
        });
      }

      const customToken = req.headers['x-transact-token'] || undefined;
      const isMock = req.headers['x-mock-transact'] === 'true' || body.mock === true || query.mock === 'true';

      try {
        const result = await syncCustomerWithTransact(personalCode, {
          token: customToken,
          overrides: body.transactPayloadOverrides || body.body || {},
          mock: isMock,
          force: Boolean(body.force === true || query.force === 'true')
        });
        return sendJson(res, 200, result);
      } catch (err) {
        return sendJson(res, err.statusCode || 500, {
          success: false,
          error: err.code || 'TRANSACT_ERROR',
          message: err.message,
          transactResponse: err.transactResponse,
          transactPayload: err.transactPayload
        });
      }
    }

    // Direct lookup by PersonalCode: GET /persons/physical/by-personal-code/:code
    const pcMatch = pathname.match(/^\/persons\/physical\/by-personal-code\/([^\/]+)$/);
    if (method === 'GET' && pcMatch) {
      const personalCode = decodeURIComponent(pcMatch[1]);
      for (const p of db.physicalPersons.values()) {
        if (String(p.PersonalCode).trim() === String(personalCode).trim()) {
          return sendJson(res, 200, p);
        }
      }
      return sendJson(res, 404, {
        success: false,
        error: 'CUSTOMER_NOT_FOUND',
        message: `Customer with PersonalCode '${personalCode}' was not found in MCD database.`
      });
    }

    // 1. PHYSICAL PERSONS ENDPOINTS
    // ---------------------------------------------------------

    // GET /persons/physical - Search physical persons
    if (method === 'GET' && pathname === '/persons/physical') {
      const results = [];
      const qFirstName = query.firstName || query.FirstName;
      const qLastName = query.lastName || query.LastName;
      const qPersonalCode = query.personalCode || query.PersonalCode;
      const qCountryCode = query.countryCode || query.CountryCode;
      const qIsJunior = query.isJunior !== undefined ? query.isJunior : query.IsJunior;

      for (const p of db.physicalPersons.values()) {
        let match = true;
        const pFirstName = p.firstName || p.FirstName || '';
        const pLastName = p.lastName || p.LastName || '';
        const pPersonalCode = p.personalCode || p.PersonalCode || '';
        const pCountryCode = p.countryCode || p.CountryCode || '';
        const pIsMinor = Boolean(p.isMinor !== undefined ? p.isMinor : p.IsMinor);

        if (qFirstName && !pFirstName.toLowerCase().includes(qFirstName.toLowerCase())) match = false;
        if (qLastName && !pLastName.toLowerCase().includes(qLastName.toLowerCase())) match = false;
        if (qPersonalCode && String(pPersonalCode) !== String(qPersonalCode)) match = false;
        if (qCountryCode && pCountryCode !== qCountryCode) match = false;
        if (qIsJunior !== undefined) {
          const isJuniorBool = qIsJunior === 'true';
          if (pIsMinor !== isJuniorBool) match = false;
        }
        if (match) {
          results.push({
            mcdId: p.mcdId || p.McdId,
            firstName: pFirstName,
            middleName: p.middleName !== undefined ? p.middleName : (p.MiddleName !== undefined ? p.MiddleName : null),
            lastName: pLastName,
            personalCode: pPersonalCode,
            countryCode: pCountryCode,
            status: p.status || p.Status || 'Prospect',
            transactID: p.transactID !== undefined ? p.transactID : (p.TransactID !== undefined ? p.TransactID : (p.transactId || null)),
            selectedProducts: p.selectedProducts || p.SelectedProducts || []
          });
        }
      }
      return sendJson(res, 200, results);
    }

    // POST /persons/physical - Create physical prospect
    if (method === 'POST' && pathname === '/persons/physical') {
      const body = await parseBody(req);
      const firstName = body.FirstName || body.firstName;
      const lastName = body.LastName || body.lastName;
      const personalCode = body.PersonalCode || body.personalCode;

      if (!firstName || !lastName || !personalCode) {
        return sendJson(res, 400, {
          ErrorCode: '400001',
          ErrorMessage: 'Missing mandatory fields: firstName, lastName, personalCode'
        });
      }

      // Check if this personalCode already belongs to an existing MCD customer with a TransactID, or if TransactID was provided in body
      let existingCustomer = null;
      for (const [key, p] of db.physicalPersons.entries()) {
        if (String(p.PersonalCode).trim() === String(personalCode).trim()) {
          existingCustomer = p;
          break;
        }
      }

      const preExistingId = (body.TransactID || body.transactId) ||
        (existingCustomer && (existingCustomer.TransactID || existingCustomer.TransactId));
      const hasId = preExistingId &&
        String(preExistingId).trim() !== '' &&
        preExistingId !== 'null' &&
        preExistingId !== 'undefined' &&
        preExistingId !== 'None' &&
        preExistingId !== 'Pending';

      const newMcdId = generatePhysicalMcdId();
      const dob = body.DateOfBirth || body.dateOfBirth || '1995-01-01';
      const isMinor = dob && (new Date().getFullYear() - new Date(dob).getFullYear() < 18);
      const email = body.PrimaryEmail || body.primaryEmail || body.email || null;
      const phone = body.PrimaryPhoneNumber || body.primaryPhoneNumber || body.phoneNumber || null;
      const countryCode = body.CountryCode || body.countryCode || 'LT';
      const gender = body.Gender || body.gender || 'MALE';
      const ssn = body.Ssn || body.ssn || body.TaxId || body.taxId || null;

      const regAddr = body.RegistrationAddress || body.registrationAddress || body.ResidenceAddress || body.residenceAddress || {
        countryCode: countryCode,
        city: 'Vilnius',
        street: 'Gedimino pr. 1'
      };

      const newPerson = {
        McdId: newMcdId,
        mcdId: newMcdId,
        FirstName: firstName,
        MiddleName: body.MiddleName || body.middleName || null,
        LastName: lastName,
        PersonalCode: personalCode,
        Ssn: ssn,
        CountryCode: countryCode,
        Gender: gender,
        Status: 'Prospect',
        TransactID: hasId ? String(preExistingId) : null,
        TransactId: hasId ? String(preExistingId) : null,
        TransactStatus: hasId ? 'Synced' : 'Pending',
        DateOfBirth: dob,
        DateOfDeath: null,
        BirthCountryCode: countryCode,
        BirthCity: 'Vilnius',
        LanguageCode: 'lt',
        PrimaryEmail: email,
        PrimaryEmailVerified: Boolean(body.PrimaryEmailVerified ?? body.emailVerified),
        SecondaryEmail: null,
        PrimaryPhoneNumber: phone,
        PrimaryPhoneNumberVerified: Boolean(body.PrimaryPhoneNumberVerified ?? body.phoneNumberVerified),
        SecondaryPhoneNumber: null,
        RegistrationAddress: regAddr,
        ResidenceAddress: body.ResidenceAddress || body.residenceAddress || null,
        CorrespondenceAddress: body.CorrespondenceAddress || body.correspondenceAddress || regAddr,
        Consents: {
          ConsentOffers: true,
          ConsentProfiling: false,
          ConsentPartnersOffers: false,
          Date: new Date().toISOString(),
          ValidUntil: '2028-12-31'
        },
        Nationalities: [body.countryCode || 'LT'],
        IdDocuments: [],
        OndatoCheckValid: true,
        AmlScreening: {
          LastAmlResultDate: new Date().toISOString(),
          AmlResult: 'PASSED',
          SmaApprovalStatus: 'APPROVED',
          SmaDecisionDate: new Date().toISOString()
        },
        Kyc: {
          IsKycRequired: false,
          ExpirationDate: '2027-01-01'
        },
        SelectedProducts: body.selectedProducts || [{ ProductCategory: 'ACCOUNTS', ProductId: 'STANDARD' }],
        HasParentalPermissionToManageProducts: isMinor ? false : null,
        IsMinor: Boolean(isMinor),
        IsEmancipatedMinor: false,
        IsIncapable: false,
        guardianMcdId: body.onboardingClientMcdId || null,
        coapplicantMcdId: null
      };

      db.physicalPersons.set(newMcdId, newPerson);
      syncDbToFile();

      // If customer already has a TransactID, do NOT create or call Transact API
      if (hasId) {
        newPerson.alreadySynced = true;
        newPerson.transactNotice = `Customer already has TransactID '${preExistingId}'. No new Transact customer was created.`;
        return sendJson(res, 201, newPerson);
      }

      // Automatically sync with Temenos Transact Core Banking API using customer's personal code
      try {
        const syncResult = await syncCustomerWithTransact(newPerson.PersonalCode, {
          mock: Boolean(body.mock || req.headers['x-mock-transact'] === 'true' || process.env.MOCK_TRANSACT === 'true')
        });
        if (syncResult && syncResult.transactId) {
          newPerson.TransactID = String(syncResult.transactId);
          newPerson.TransactId = String(syncResult.transactId);
          newPerson.TransactSyncDate = syncResult.customer.TransactSyncDate || new Date().toISOString();
          newPerson.TransactStatus = syncResult.alreadySynced ? 'Already Synced' : 'Synced';
          newPerson.alreadySynced = Boolean(syncResult.alreadySynced);
          if (syncResult.alreadySynced) {
            newPerson.transactNotice = syncResult.message;
          }
          if (syncResult.transactResponse) {
            newPerson.transactResponse = syncResult.transactResponse;
          }
          db.physicalPersons.set(newMcdId, newPerson);
          syncDbToFile();
        }
      } catch (transactErr) {
        console.warn(`[POST /persons/physical] Notice: Transact sync for ${newPerson.PersonalCode} encountered error: ${transactErr.message}`);
        newPerson.TransactStatus = 'Sync Failed';
        newPerson.TransactError = transactErr.message;
        db.physicalPersons.set(newMcdId, newPerson);
        syncDbToFile();
      }

      return sendJson(res, 201, newPerson);
    }

    // GET /persons/physical/:mcdId/potentialGuardians
    let m = pathname.match(/^\/persons\/physical\/([^\/]+)\/potentialGuardians$/);
    if (method === 'GET' && m) {
      const mcdId = m[1];
      const person = getPhysicalPerson(mcdId);
      if (!person) {
        return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Physical person ${mcdId} not found` });
      }
      const potentialGuardians = [
        { mcdId: 'F20014528', firstName: 'Jonas', lastName: 'Kazlauskas', personalCode: '38501010001' },
        { mcdId: 'F20014529', firstName: 'Ieva', lastName: 'Kazlauskienė', personalCode: '48802020002' }
      ].filter(g => g.mcdId !== (person.mcdId || person.McdId));

      return sendJson(res, 200, potentialGuardians);
    }

    // PUT /persons/physical/:mcdId/guardian/:guardianMcdId
    m = pathname.match(/^\/persons\/physical\/([^\/]+)\/guardian\/([^\/]+)$/);
    if (method === 'PUT' && m) {
      const [, mcdId, guardianMcdId] = m;
      const person = getPhysicalPerson(mcdId);
      const guardian = getPhysicalPerson(guardianMcdId);
      if (!person) return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Child person ${mcdId} not found` });
      if (!guardian) return sendJson(res, 404, { ErrorCode: '404002', ErrorMessage: `Guardian person ${guardianMcdId} not found` });

      person.guardianMcdId = guardian.mcdId || guardian.McdId;
      syncDbToFile();
      return sendJson(res, 200, { success: true, message: `Guardian ${guardianMcdId} set for junior ${mcdId}` });
    }

    // GET /persons/physical/:mcdId/children
    m = pathname.match(/^\/persons\/physical\/([^\/]+)\/children$/);
    if (method === 'GET' && m) {
      const mcdId = m[1];
      const person = getPhysicalPerson(mcdId);
      if (!person) return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Person ${mcdId} not found` });
      const targetId = person.mcdId || person.McdId;

      const children = [];
      for (const p of db.physicalPersons.values()) {
        if (p.guardianMcdId === targetId || p.guardianMcdId === mcdId || (p.IsMinor && p.LastName === person.LastName)) {
          children.push({
            firstName: p.firstName || p.FirstName,
            lastName: p.lastName || p.LastName,
            personalCode: p.personalCode || p.PersonalCode,
            dateOfBirth: p.dateOfBirth || p.DateOfBirth,
            mcdId: p.mcdId || p.McdId,
            phoneNumber: p.primaryPhoneNumber || p.PrimaryPhoneNumber,
            phoneNumberVerified: p.primaryPhoneNumberVerified || p.PrimaryPhoneNumberVerified,
            email: p.primaryEmail || p.PrimaryEmail,
            emailVerified: p.primaryEmailVerified || p.PrimaryEmailVerified,
            countryCode: p.countryCode || p.CountryCode,
            isWard: p.guardianMcdId === targetId || p.guardianMcdId === mcdId
          });
        }
      }
      return sendJson(res, 200, children);
    }

    // PUT /persons/physical/:mcdId/coapplicant/:coapplicantMcdId
    m = pathname.match(/^\/persons\/physical\/([^\/]+)\/coapplicant\/([^\/]+)$/);
    if (method === 'PUT' && m) {
      const [, mcdId, coapplicantMcdId] = m;
      const person = getPhysicalPerson(mcdId);
      const coapplicant = getPhysicalPerson(coapplicantMcdId);
      if (!person || !coapplicant) {
        return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: 'Person or coapplicant not found' });
      }
      person.coapplicantMcdId = coapplicant.mcdId || coapplicant.McdId;
      coapplicant.coapplicantMcdId = person.mcdId || person.McdId;
      syncDbToFile();
      return sendJson(res, 200, { success: true, message: `Coapplicants ${mcdId} and ${coapplicantMcdId} linked` });
    }

    // POST /persons/physical/:mcdId/consent
    m = pathname.match(/^\/persons\/physical\/([^\/]+)\/consent$/);
    if (method === 'POST' && m) {
      const mcdId = m[1];
      const person = getPhysicalPerson(mcdId);
      if (!person) return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Person ${mcdId} not found` });

      const body = await parseBody(req);
      person.Consents = {
        ConsentOffers: Boolean(body.ConsentOffers),
        ConsentProfiling: Boolean(body.ConsentProfiling),
        ConsentPartnersOffers: Boolean(body.ConsentPartnersOffers),
        Date: new Date().toISOString(),
        ValidUntil: body.ValidUntil || '2029-12-31'
      };
      syncDbToFile();
      return sendJson(res, 200, person.Consents);
    }

    // GET /persons/physical/:mcdId - Get physical person full details
    m = pathname.match(/^\/persons\/physical\/([^\/]+)$/);
    if (method === 'GET' && m) {
      const mcdId = m[1];
      const person = getPhysicalPerson(mcdId);
      if (!person) return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Physical person ${mcdId} not found` });
      return sendJson(res, 200, person);
    }

    // PUT /persons/physical/:mcdId - Update physical person
    m = pathname.match(/^\/persons\/physical\/([^\/]+)$/);
    if (method === 'PUT' && m) {
      const mcdId = m[1];
      const person = getPhysicalPerson(mcdId);
      if (!person) return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Physical person ${mcdId} not found` });

      const body = await parseBody(req);
      if (body.PrimaryEmail !== undefined) person.PrimaryEmail = body.PrimaryEmail;
      if (body.PrimaryEmailVerified !== undefined) person.PrimaryEmailVerified = body.PrimaryEmailVerified;
      if (body.PrimaryPhoneNumber !== undefined) person.PrimaryPhoneNumber = body.PrimaryPhoneNumber;
      if (body.PrimaryPhoneNumberVerified !== undefined) person.PrimaryPhoneNumberVerified = body.PrimaryPhoneNumberVerified;
      if (body.ResidenceAddress) person.ResidenceAddress = body.ResidenceAddress;
      if (body.CorrespondenceAddress) person.CorrespondenceAddress = body.CorrespondenceAddress;
      if (body.SelectedProducts) person.SelectedProducts = body.SelectedProducts;

      syncDbToFile();
      return sendJson(res, 200, person);
    }

    // ---------------------------------------------------------
    // 2. JURIDICAL PERSONS (SME) ENDPOINTS
    // ---------------------------------------------------------

    // GET /persons/juridical/accumulated - Search accumulated account
    if (method === 'GET' && pathname === '/persons/juridical/accumulated') {
      const results = [];
      const companyNameQuery = (query.CompanyName || '').toLowerCase().replace(/['"]/g, '').trim();

      for (const acc of db.accumulatedJuridicalPersons.values()) {
        const cleanName = acc.FullName.toLowerCase().replace(/['"]/g, '').trim();
        if (!companyNameQuery || cleanName.includes(companyNameQuery)) {
          results.push({
            mcdId: acc.mcdId || acc.McdId,
            fullName: acc.fullName || acc.FullName,
            companyCode: acc.companyCode || acc.CompanyCode,
            countryCode: acc.countryCode || acc.CountryCode,
            status: acc.status || acc.Status,
            transactID: acc.transactID || acc.TransactID || acc.transactId || acc.TransactId || null
          });
        }
      }
      return sendJson(res, 200, results);
    }

    // PUT /persons/juridical/accumulated - Ensure accumulated account with representative
    if (method === 'PUT' && pathname === '/persons/juridical/accumulated') {
      const body = await parseBody(req);
      const rep = body.representativeDetails || {};
      const jur = body.juridicalPersonDetails || {};

      if (!rep.firstName || !rep.lastName || !rep.personalCode || !jur.fullName) {
        return sendJson(res, 400, {
          ErrorCode: '400001',
          ErrorMessage: 'Missing required representative or juridical person details'
        });
      }

      let representative = null;
      for (const r of db.representatives.values()) {
        if (r.PersonalCode === rep.personalCode) {
          representative = r;
          break;
        }
      }
      if (!representative) {
        const rId = 'R' + (repSeq++);
        representative = {
          McdId: rId,
          FirstName: rep.firstName,
          LastName: rep.lastName,
          PersonalCode: rep.personalCode,
          CountryCode: rep.countryCode || 'LT',
          Status: 'Prospect'
        };
        db.representatives.set(rId, representative);
      }

      const accId = 'A' + (accSeq++);
      const accumulatedAccount = {
        McdId: accId,
        FullName: jur.fullName,
        CompanyCode: 'EST-' + Math.floor(100000 + Math.random() * 900000),
        CountryCode: 'LT',
        Status: 'Prospect',
        TransactId: 'TX-ACC-' + Math.floor(1000 + Math.random() * 9000),
        RepresentativeMcdId: representative.McdId,
        phoneNumber: jur.phoneNumber,
        secondaryPhoneNumber: jur.secondaryPhoneNumber,
        registrationAddress: jur.registrationAddress,
        selectedProducts: jur.selectedProducts || [{ ProductCategory: 'ACCUMULATED', ProductId: 'DEFAULT' }]
      };
      db.accumulatedJuridicalPersons.set(accId, accumulatedAccount);
      syncDbToFile();

      return sendJson(res, 200, {
        juridicalPerson: {
          McdId: accumulatedAccount.McdId,
          FullName: accumulatedAccount.FullName,
          CompanyCode: accumulatedAccount.CompanyCode,
          CountryCode: accumulatedAccount.CountryCode,
          Status: accumulatedAccount.Status,
          TransactId: accumulatedAccount.TransactId
        },
        representative: {
          McdId: representative.McdId,
          FirstName: representative.FirstName,
          LastName: representative.LastName,
          PersonalCode: representative.PersonalCode,
          CountryCode: representative.CountryCode,
          Status: representative.Status
        }
      });
    }

    // POST /persons/juridical/:mcdId/transformFromAccumulated
    m = pathname.match(/^\/persons\/juridical\/([^\/]+)\/transformFromAccumulated$/);
    if (method === 'POST' && m) {
      const mcdId = m[1];
      const acc = db.accumulatedJuridicalPersons.get(mcdId);
      if (!acc) {
        return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Accumulated account ${mcdId} not found` });
      }

      const body = await parseBody(req);
      const compCode = body.juridicalPersonDetails?.companyCode || ('305' + Math.floor(100000 + Math.random() * 900000));
      const repDetails = body.representativeDetails || {};

      let rep = null;
      for (const r of db.representatives.values()) {
        if (r.PersonalCode === repDetails.personalCode) {
          rep = r;
          break;
        }
      }
      if (!rep) {
        const rId = 'R' + (repSeq++);
        rep = {
          McdId: rId,
          FirstName: repDetails.firstName || 'Rep',
          LastName: repDetails.lastName || 'LastName',
          PersonalCode: repDetails.personalCode || '38000000000',
          CountryCode: repDetails.countryCode || 'LT',
          Status: 'Existing'
        };
        db.representatives.set(rId, rep);
      }

      const newJurId = generateJuridicalMcdId();
      const newJur = {
        McdId: newJurId,
        mcdId: newJurId,
        FullName: acc.FullName,
        CompanyCode: compCode,
        CountryCode: 'LT',
        Status: 'Existing',
        TransactId: 'TX-TRF-' + Math.floor(10000 + Math.random() * 90000),
        PrimaryEmail: 'info@' + acc.FullName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.lt',
        PrimaryEmailVerified: true,
        SecondaryEmail: null,
        PrimaryPhoneNumber: acc.phoneNumber || '+37060000000',
        PrimaryPhoneNumberVerified: true,
        SecondaryPhoneNumber: acc.secondaryPhoneNumber || null,
        RegistrationAddress: acc.registrationAddress || { countryCode: 'LT', city: 'Vilnius', street: 'Gedimino pr. 1' },
        ResidenceAddress: null,
        CorrespondenceAddress: acc.registrationAddress || { countryCode: 'LT', city: 'Vilnius' },
        Consents: {
          ConsentOffers: true,
          ConsentPartnersOffers: false
        },
        AmlScreening: {
          LastAmlResultDate: new Date().toISOString(),
          AmlResult: 'PASSED',
          SmaApprovalStatus: 'APPROVED',
          SmaDecisionDate: new Date().toISOString()
        },
        Kyc: {
          IsKycRequired: false,
          ExpirationDate: '2028-01-01'
        },
        SelectedProducts: acc.selectedProducts || [{ ProductCategory: 'BUSINESS', ProductId: 'SME_PACKAGE' }],
        FinalBeneficiariesMissing: false,
        RepresentativeMcdId: rep.McdId
      };

      db.juridicalPersons.set(newJurId, newJur);
      db.accumulatedJuridicalPersons.delete(mcdId);
      syncDbToFile();

      return sendJson(res, 200, {
        juridicalPerson: {
          McdId: newJur.McdId,
          FullName: newJur.FullName,
          CompanyCode: newJur.CompanyCode,
          CountryCode: newJur.CountryCode,
          Status: newJur.Status,
          TransactId: newJur.TransactId
        },
        representative: {
          McdId: rep.McdId,
          FirstName: rep.FirstName,
          LastName: rep.LastName,
          PersonalCode: rep.PersonalCode,
          CountryCode: rep.CountryCode,
          Status: rep.Status
        }
      });
    }

    // GET /persons/juridical/:mcdId/representatives/:representativeMcdId - Validate representative
    m = pathname.match(/^\/persons\/juridical\/([^\/]+)\/representatives\/([^\/]+)$/);
    if (method === 'GET' && m) {
      const [, mcdId, representativeMcdId] = m;
      const jur = getJuridicalPerson(mcdId);
      const rep = db.representatives.get(representativeMcdId);
      if (!jur || !rep) {
        return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: 'Company or representative not found' });
      }

      if (jur.RepresentativeMcdId === representativeMcdId) {
        return sendJson(res, 200, {
          McdId: rep.McdId,
          FirstName: rep.FirstName,
          LastName: rep.LastName,
          PersonalCode: rep.PersonalCode,
          CountryCode: rep.CountryCode,
          Status: rep.Status
        });
      } else {
        return sendJson(res, 404, { ErrorCode: '404002', ErrorMessage: 'Representative is not linked to this company' });
      }
    }

    // POST /persons/juridical/:mcdId/consent
    m = pathname.match(/^\/persons\/juridical\/([^\/]+)\/consent$/);
    if (method === 'POST' && m) {
      const mcdId = m[1];
      const jur = getJuridicalPerson(mcdId);
      if (!jur) return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Juridical person ${mcdId} not found` });

      const body = await parseBody(req);
      jur.Consents = {
        ConsentOffers: Boolean(body.ConsentOffers),
        ConsentPartnersOffers: Boolean(body.ConsentPartnersOffers)
      };
      syncDbToFile();
      return sendJson(res, 200, jur.Consents);
    }

    // GET /persons/juridical - Search juridical person
    if (method === 'GET' && pathname === '/persons/juridical') {
      const results = [];
      const qCompanyCode = query.companyCode || query.CompanyCode;
      const qCountryCode = query.countryCode || query.CountryCode;
      for (const j of db.juridicalPersons.values()) {
        let match = true;
        const jCompanyCode = j.companyCode || j.CompanyCode;
        const jCountryCode = j.countryCode || j.CountryCode;
        if (qCompanyCode && jCompanyCode !== qCompanyCode) match = false;
        if (qCountryCode && jCountryCode !== qCountryCode) match = false;
        if (match) {
          results.push({
            mcdId: j.mcdId || j.McdId,
            fullName: j.fullName || j.FullName,
            companyCode: j.companyCode || j.CompanyCode,
            countryCode: j.countryCode || j.CountryCode,
            status: j.status || j.Status,
            transactID: j.transactID || j.TransactID || j.transactId || j.TransactId || null
          });
        }
      }
      return sendJson(res, 200, results);
    }

    // PUT /persons/juridical - Ensure juridical prospect with representative
    if (method === 'PUT' && pathname === '/persons/juridical') {
      const body = await parseBody(req);
      const rep = body.representative || {};
      const jur = body.juridicalPerson || {};

      let representative = null;
      for (const r of db.representatives.values()) {
        if (r.PersonalCode === rep.personalCode) {
          representative = r;
          break;
        }
      }
      if (!representative) {
        const rId = 'R' + (repSeq++);
        representative = {
          McdId: rId,
          FirstName: rep.firstName || 'Rep',
          LastName: rep.lastName || 'LastName',
          PersonalCode: rep.personalCode || '38000000000',
          CountryCode: rep.countryCode || 'LT',
          Status: 'Prospect'
        };
        db.representatives.set(rId, representative);
      }

      let juridical = null;
      for (const j of db.juridicalPersons.values()) {
        if (j.CompanyCode === jur.companyCode) {
          juridical = j;
          break;
        }
      }
      if (!juridical) {
        const jId = generateJuridicalMcdId();
        juridical = {
          McdId: jId,
          mcdId: jId,
          FullName: jur.fullName || 'UAB Nauja Kompanija',
          CompanyCode: jur.companyCode || ('305' + Math.floor(100000 + Math.random() * 900000)),
          CountryCode: jur.countryCode || 'LT',
          Status: 'Prospect',
          TransactId: 'TX-J-' + Math.floor(10000 + Math.random() * 90000),
          PrimaryEmail: 'contact@company.lt',
          PrimaryEmailVerified: true,
          PrimaryPhoneNumber: '+37060000000',
          PrimaryPhoneNumberVerified: true,
          RegistrationAddress: { countryCode: 'LT', city: 'Vilnius', street: 'Gedimino pr. 10' },
          SelectedProducts: [{ ProductCategory: 'BUSINESS_ACCOUNTS', ProductId: 'SME_STANDARD' }],
          RepresentativeMcdId: representative.McdId
        };
        db.juridicalPersons.set(jId, juridical);
      }
      syncDbToFile();

      return sendJson(res, 200, {
        juridicalPerson: {
          McdId: juridical.McdId,
          FullName: juridical.FullName,
          CompanyCode: juridical.CompanyCode,
          CountryCode: juridical.CountryCode,
          Status: juridical.Status,
          TransactId: juridical.TransactId
        },
        representative: {
          McdId: representative.McdId,
          FirstName: representative.FirstName,
          LastName: representative.LastName,
          PersonalCode: representative.PersonalCode,
          CountryCode: representative.CountryCode,
          Status: representative.Status
        }
      });
    }

    // GET /persons/juridical/:mcdId - Get juridical person
    m = pathname.match(/^\/persons\/juridical\/([^\/]+)$/);
    if (method === 'GET' && m) {
      const mcdId = m[1];
      const jur = getJuridicalPerson(mcdId);
      if (!jur) return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Juridical person ${mcdId} not found` });
      return sendJson(res, 200, jur);
    }

    // PUT /persons/juridical/:mcdId - Update juridical person
    m = pathname.match(/^\/persons\/juridical\/([^\/]+)$/);
    if (method === 'PUT' && m) {
      const mcdId = m[1];
      const jur = getJuridicalPerson(mcdId);
      if (!jur) return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Juridical person ${mcdId} not found` });

      const body = await parseBody(req);
      if (body.FullName) jur.FullName = body.FullName;
      if (body.PrimaryEmail) jur.PrimaryEmail = body.PrimaryEmail;
      if (body.PrimaryPhoneNumber) jur.PrimaryPhoneNumber = body.PrimaryPhoneNumber;
      if (body.RegistrationAddress) jur.RegistrationAddress = body.RegistrationAddress;
      if (body.SelectedProducts) jur.SelectedProducts = body.SelectedProducts;
      if (body.RepresentativeMcdId) jur.RepresentativeMcdId = body.RepresentativeMcdId;

      syncDbToFile();
      return sendJson(res, 200, jur);
    }

    // ---------------------------------------------------------
    // 3. REPRESENTATIVES ENDPOINTS
    // ---------------------------------------------------------

    // GET /persons/representatives - Search representatives
    if (method === 'GET' && pathname === '/persons/representatives') {
      const results = [];
      const qFirstName = query.firstName || query.FirstName;
      const qLastName = query.lastName || query.LastName;
      const qPersonalCode = query.personalCode || query.PersonalCode;
      const qCountryCode = query.countryCode || query.CountryCode;
      for (const r of db.representatives.values()) {
        let match = true;
        const rFirstName = r.firstName || r.FirstName || '';
        const rLastName = r.lastName || r.LastName || '';
        const rPersonalCode = r.personalCode || r.PersonalCode || '';
        const rCountryCode = r.countryCode || r.CountryCode || '';
        if (qFirstName && !rFirstName.toLowerCase().includes(qFirstName.toLowerCase())) match = false;
        if (qLastName && !rLastName.toLowerCase().includes(qLastName.toLowerCase())) match = false;
        if (qPersonalCode && rPersonalCode !== qPersonalCode) match = false;
        if (qCountryCode && rCountryCode !== qCountryCode) match = false;
        if (match) {
          results.push({
            mcdId: r.mcdId || r.McdId,
            firstName: rFirstName,
            lastName: rLastName,
            personalCode: rPersonalCode,
            countryCode: rCountryCode,
            status: r.status || r.Status || 'Existing'
          });
        }
      }
      return sendJson(res, 200, results);
    }

    // GET /persons/representatives/:mcdId - Get representative
    m = pathname.match(/^\/persons\/representatives\/([^\/]+)$/);
    if (method === 'GET' && m) {
      const mcdId = m[1];
      const rep = db.representatives.get(mcdId);
      if (!rep) return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Representative ${mcdId} not found` });
      return sendJson(res, 200, rep);
    }

    // PUT /persons/representatives/:mcdId - Update representative
    m = pathname.match(/^\/persons\/representatives\/([^\/]+)$/);
    if (method === 'PUT' && m) {
      const mcdId = m[1];
      const rep = db.representatives.get(mcdId);
      if (!rep) return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Representative ${mcdId} not found` });

      const body = await parseBody(req);
      if (body.LanguageCode) rep.LanguageCode = body.LanguageCode;
      if (body.PrimaryEmail) rep.PrimaryEmail = body.PrimaryEmail;
      if (body.PrimaryPhoneNumber) rep.PrimaryPhoneNumber = body.PrimaryPhoneNumber;
      if (body.ResidenceAddress) rep.ResidenceAddress = body.ResidenceAddress;
      if (body.CorrespondenceAddress) rep.CorrespondenceAddress = body.CorrespondenceAddress;

      syncDbToFile();
      return sendJson(res, 200, rep);
    }

    // 404 Fallback
    return sendJson(res, 404, {
      ErrorCode: '404000',
      ErrorMessage: `Route ${method} ${pathname} not found in MCD Infinity API. Check /docs or / for available endpoints.`
    });

  } catch (error) {
    console.error('Server error:', error);
    return sendJson(res, 500, {
      ErrorCode: '500000',
      ErrorMessage: error.message || 'Internal Server Error'
    });
  }
}

// -------------------------------------------------------------
// Interactive Dashboard HTML Renderer with Database Editor
// -------------------------------------------------------------
export function renderDashboardHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MCD Infinity API - Live Server & Database Explorer</title>
  <link rel="icon" href="https://assets.apidog.com/app/project-icon/builtin/15.jpg">
  <script>
    (function() {
      var savedTheme = localStorage.getItem('mcd-theme');
      if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    })();
  </script>
  <style>
    :root {
      --primary: #9373ee;
      --primary-dark: #6e4bc5;
      --bg: #0f172a;
      --card-bg: #1e293b;
      --card-inner: #0f172a;
      --border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --text-heading: #ffffff;
      --btn-secondary-bg: #334155;
      --btn-secondary-hover: #475569;
      --btn-secondary-color: #ffffff;
      --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
      --terminal-bg: #090d16;
      --terminal-border: #1e293b;
      --terminal-color: #38bdf8;
      --table-header: #1e293b;
      --table-row-hover: rgba(147, 115, 238, 0.08);
      --input-bg: #0b1120;
      --input-border: #334155;
      --input-color: #f8fafc;
      --sync-gradient: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95));
      --sync-border: rgba(56, 189, 248, 0.35);
      --sync-title: #38bdf8;
      --sync-badge-bg: rgba(56, 189, 248, 0.15);
      --sync-badge-color: #38bdf8;
      --accent-green: #10b981;
      --accent-blue: #38bdf8;
      --accent-orange: #f59e0b;
      --accent-purple: #c084fc;
      --accent-red: #ef4444;
      --modal-card-bg: #1e293b;
      --modal-footer-bg: #0f172a;
    }

    [data-theme="light"] {
      --primary: #7c3aed;
      --primary-dark: #6d28d9;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --card-inner: #f1f5f9;
      --border: #e2e8f0;
      --text: #1e293b;
      --text-muted: #64748b;
      --text-heading: #0f172a;
      --btn-secondary-bg: #f1f5f9;
      --btn-secondary-hover: #e2e8f0;
      --btn-secondary-color: #1e293b;
      --card-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
      --terminal-bg: #0f172a;
      --terminal-border: #334155;
      --terminal-color: #38bdf8;
      --table-header: #f8fafc;
      --table-row-hover: rgba(124, 58, 237, 0.05);
      --input-bg: #ffffff;
      --input-border: #cbd5e1;
      --input-color: #0f172a;
      --sync-gradient: linear-gradient(135deg, #f0f9ff, #ffffff);
      --sync-border: rgba(2, 132, 199, 0.25);
      --sync-title: #0284c7;
      --sync-badge-bg: rgba(2, 132, 199, 0.1);
      --sync-badge-color: #0284c7;
      --accent-green: #059669;
      --accent-blue: #0284c7;
      --accent-orange: #d97706;
      --accent-purple: #7c3aed;
      --accent-red: #dc2626;
      --modal-card-bg: #ffffff;
      --modal-footer-bg: #f8fafc;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 24px;
      transition: background 0.2s, color 0.2s;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: 20px;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .brand { display: flex; align-items: center; gap: 16px; }
    .brand img { width: 48px; height: 48px; border-radius: 12px; }
    .title h1 { font-size: 24px; font-weight: 700; color: var(--text-heading); }
    .title p { font-size: 14px; color: var(--text-muted); }
    .badge-status {
      background: rgba(16, 185, 129, 0.15);
      color: var(--accent-green);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .badge-status::before {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-green);
      display: inline-block;
    }
    .nav-links { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
    .btn {
      background: var(--primary);
      color: #fff;
      text-decoration: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: none;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, color 0.2s;
    }
    .btn:hover { background: var(--primary-dark); }
    .btn-secondary { background: var(--btn-secondary-bg); color: var(--btn-secondary-color); border: 1px solid var(--border); }
    .btn-secondary:hover { background: var(--btn-secondary-hover); }
    .btn-success { background: #059669; }
    .btn-success:hover { background: #047857; }
    .btn-danger { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
    .btn-danger:hover { background: rgba(239, 68, 68, 0.3); }

    .btn-sm { padding: 4px 8px; font-size: 12px; border-radius: 6px; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      box-shadow: var(--card-shadow);
      transition: transform 0.15s, border-color 0.15s, background 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      border-color: var(--primary);
    }
    .stat-label { font-size: 12px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; }
    .stat-value { font-size: 28px; font-weight: 700; margin-top: 4px; color: var(--text-heading); }
    .stat-hint { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

    .tab-nav {
      display: flex;
      gap: 12px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 24px;
    }
    .tab-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 15px;
      font-weight: 600;
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }
    .tab-btn.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    .main-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    @media (max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      box-shadow: var(--card-shadow);
      transition: background 0.2s, border-color 0.2s;
    }
    .card-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
      color: var(--text-heading);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .endpoint-list { display: flex; flex-direction: column; gap: 8px; }
    .endpoint-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--card-inner);
      border: 1px solid var(--border);
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      color: var(--text);
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
    }
    .endpoint-item:hover { border-color: var(--primary); background: var(--table-row-hover); }
    .method-tag {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      margin-right: 10px;
    }
    .method-get { background: rgba(56, 189, 248, 0.15); color: var(--accent-blue); }
    .method-post { background: rgba(16, 185, 129, 0.15); color: var(--accent-green); }
    .method-put { background: rgba(245, 158, 11, 0.15); color: var(--accent-orange); }

    .terminal {
      background: var(--terminal-bg);
      border: 1px solid var(--terminal-border);
      border-radius: 8px;
      padding: 16px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      color: var(--terminal-color);
      max-height: 480px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* Database Table Styling */
    .table-container {
      overflow-x: auto;
      background: var(--card-inner);
      border-radius: 8px;
      border: 1px solid var(--border);
      margin-top: 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
      color: var(--text);
    }
    th, td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border);
    }
    th {
      background: var(--table-header);
      color: var(--text-muted);
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
    }
    tr:hover { background: var(--table-row-hover); }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }
    .badge-existing { background: rgba(16, 185, 129, 0.15); color: var(--accent-green); }
    .badge-prospect { background: rgba(245, 158, 11, 0.15); color: var(--accent-orange); }

    /* Modal Styling */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }
    .modal-card {
      background: var(--modal-card-bg);
      border: 1px solid var(--primary);
      border-radius: 14px;
      width: 100%;
      max-width: 750px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .modal-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .modal-header h3 { font-size: 18px; color: var(--text-heading); }
    .modal-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }
    .modal-footer {
      padding: 16px 20px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      background: var(--modal-footer-bg);
      border-bottom-left-radius: 14px;
      border-bottom-right-radius: 14px;
    }
    .json-editor {
      width: 100%;
      height: 380px;
      background: var(--terminal-bg);
      color: var(--terminal-color);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      line-height: 1.4;
      resize: vertical;
    }
    .json-editor:focus { outline: none; border-color: var(--primary); }
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #10b981;
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
      display: none;
      z-index: 2000;
    }

    /* System Switcher */
    .system-switcher-container {
      margin-bottom: 24px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 6px;
      box-shadow: var(--card-shadow);
    }
    .system-switcher {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    @media (max-width: 680px) {
      .system-switcher { grid-template-columns: 1fr; }
    }
    .system-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      border-radius: 8px;
      border: 1px solid transparent;
      background: transparent;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
      color: var(--text-muted);
    }
    .system-btn:hover {
      background: var(--table-row-hover);
      color: var(--text);
    }
    .system-btn.active {
      background: var(--card-inner);
      border-color: var(--primary);
      color: var(--text);
      box-shadow: 0 2px 8px rgba(147, 115, 238, 0.15);
    }
    .system-btn-icon {
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: rgba(147, 115, 238, 0.15);
      flex-shrink: 0;
    }
    .system-btn.active .system-btn-icon {
      background: var(--primary);
      color: #fff;
    }
    .system-btn-text {
      display: flex;
      flex-direction: column;
    }
    .system-btn-name {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-heading);
    }
    .system-btn-desc {
      font-size: 11px;
      color: var(--text-muted);
    }

    /* Formpipe Container Styling */
    .formpipe-banner {
      background: var(--sync-gradient);
      border: 1px solid var(--sync-border);
      border-radius: 12px;
      padding: 18px 22px;
      margin-bottom: 24px;
      box-shadow: var(--card-shadow);
    }
    .formpipe-banner-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 10px;
    }
    .formpipe-banner-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 17px;
      font-weight: 700;
      color: var(--sync-title);
    }
    .formpipe-meta-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
    }
    .meta-pill {
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 6px;
      background: var(--sync-badge-bg);
      color: var(--sync-badge-color);
      font-family: monospace;
      font-weight: 600;
    }
    .formpipe-cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .formpipe-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      box-shadow: var(--card-shadow);
      transition: border-color 0.2s;
    }
    .formpipe-card:hover {
      border-color: rgba(147, 115, 238, 0.4);
    }
    .formpipe-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 14px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }
    .formpipe-endpoint-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 700;
      color: var(--text-heading);
    }
    .formpipe-payload-box {
      width: 100%;
      height: 200px;
      background: var(--terminal-bg);
      color: var(--terminal-color);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
      line-height: 1.4;
      resize: vertical;
      margin-bottom: 12px;
    }
    .formpipe-payload-box:focus {
      outline: none;
      border-color: var(--primary);
    }
    .pdf-preview-box {
      width: 100%;
      height: 480px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: #fff;
      margin-top: 14px;
      display: none;
    }
  </style>
</head>
<body>
  <div id="toast" class="toast">Record updated successfully!</div>

  <div class="header">
    <div class="brand">
      <img src="https://assets.apidog.com/app/project-icon/builtin/15.jpg" alt="Logo">
      <div class="title">
        <h1>MCD Infinity API Server & Database</h1>
        <p>Live REST API implementation & Direct Browser Database Editor</p>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
      <span class="badge-status">Server Port :${PORT}</span>
      <div class="nav-links">
        <button id="theme-toggle-btn" onclick="toggleTheme()" class="btn btn-secondary" title="Switch Theme (Light / Dark)">
          <span id="theme-icon">☀️</span> <span id="theme-label">Light Mode</span>
        </button>
        <a href="/admin/db" target="_blank" class="btn btn-secondary">DB JSON</a>
        <a href="/docs" target="_blank" class="btn">Swagger UI</a>
        <a href="/openapi.json" target="_blank" class="btn btn-secondary">OpenAPI Spec</a>
      </div>
    </div>
  </div>

  <!-- SYSTEM SWITCHER (MCD vs FORMPIPE) -->
  <div class="system-switcher-container">
    <div class="system-switcher">
      <button class="system-btn active" id="btn-system-mcd" onclick="switchSystem('mcd')">
        <div class="system-btn-icon">🏦</div>
        <div class="system-btn-text">
          <div class="system-btn-name">MCD Infinity Banking</div>
          <div class="system-btn-desc">Retail & Juridical Database, Transact T24 Sync, OpenAPI Explorer</div>
        </div>
      </button>
      <button class="system-btn" id="btn-system-formpipe" onclick="switchSystem('formpipe')">
        <div class="system-btn-icon">📄</div>
        <div class="system-btn-text">
          <div class="system-btn-name">Formpipe LaserNet APIs</div>
          <div class="system-btn-desc">Document Generation (JSON & Raw PDF) and File Retrieval (Base64 & PDF)</div>
        </div>
      </button>
    </div>
  </div>

  <!-- SYSTEM 1: MCD INFINITY -->
  <div id="system-content-mcd">
  <div class="stats-grid">
    <div class="stat-card" onclick="switchTable('physical')">
      <div class="stat-label">Physical Persons</div>
      <div class="stat-value" id="count-physical">${db.physicalPersons.size}</div>
      <div class="stat-hint">Retail, Juniors, Guardians (e.g. F20014528, F20014529, F20014530)</div>
    </div>
    <div class="stat-card" onclick="switchTable('juridical')">
      <div class="stat-label">Juridical (SME)</div>
      <div class="stat-value" id="count-juridical">${db.juridicalPersons.size}</div>
      <div class="stat-hint">Corporate clients & JAR validation (e.g. J20014528)</div>
    </div>
    <div class="stat-card" onclick="switchTable('representatives')">
      <div class="stat-label">Representatives</div>
      <div class="stat-value" id="count-rep">${db.representatives.size}</div>
      <div class="stat-hint">Founders, signatories, delegates (e.g. R3001)</div>
    </div>
    <div class="stat-card" onclick="switchTable('accumulated')">
      <div class="stat-label">Accumulated Accounts</div>
      <div class="stat-value" id="count-acc">${db.accumulatedJuridicalPersons.size}</div>
      <div class="stat-hint">Establishing capital accounts (e.g. A4001)</div>
    </div>
  </div>

  <div class="tab-nav">
    <button class="tab-btn active" id="tab-btn-db" onclick="setMainTab('db')">Database Viewer & Editor</button>
    <button class="tab-btn" id="tab-btn-api" onclick="setMainTab('api')">API Explorer & Tester</button>
  </div>

  <!-- TAB 1: DATABASE VIEWER & EDITOR -->
  <div id="tab-content-db">
    <!-- TRANSACT SYNC CARD -->
    <div class="card" style="margin-bottom: 20px; background: var(--sync-gradient); border: 1px solid var(--sync-border);">
      <div class="card-title" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:18px;">⚡</span>
          <span style="font-size:16px; font-weight:700; color:var(--sync-title);">Transact Core Banking Sync</span>
          <span style="font-size:11px; color:var(--text-muted);">(Temenos T24 Customers API)</span>
        </div>
        <span style="font-size:11px; background:var(--sync-badge-bg); color:var(--sync-badge-color); padding:3px 8px; border-radius:12px; font-family:monospace;">Target: 192.168.1.157:8085</span>
      </div>
      <div style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
        Enter a <strong>Personal Code</strong> below. The system will look up the customer in MCD, call the Transact Customer API (T24), extract the assigned <code>id</code>, and automatically update the customer's <strong>TransactID</strong> in the database!
      </div>
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <select id="sync-customer-select" onchange="if(this.value){document.getElementById('sync-personal-code').value=this.value;}" style="padding:10px 14px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:6px; color:var(--input-color); font-size:13px; max-width:320px;">
          <option value="">-- Select customer to sync --</option>
        </select>
        <input type="text" id="sync-personal-code" placeholder="Personal Code (e.g. 38501010001, 39001010099)" style="flex:1; min-width:220px; padding:10px 14px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:6px; color:var(--input-color); font-family:monospace;" value="39001010099" />
        <button class="btn btn-primary" id="btn-transact-sync" onclick="triggerTransactSync()" style="display:flex; align-items:center; gap:6px;">
          <span>⚡ Call Transact & Sync</span>
        </button>
      </div>
      <div id="transact-sync-alert" style="margin-top:12px; display:none; padding:10px 14px; border-radius:6px; font-size:13px; font-family:monospace;"></div>
    </div>
    <div class="card">
      <div class="card-title">
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <span id="current-table-title">Table: Physical Persons</span>
          <select id="table-selector" onchange="switchTable(this.value)" style="background: var(--input-bg); color: var(--input-color); border: 1px solid var(--input-border); padding: 5px 10px; border-radius: 6px; font-weight: 600;">
            <option value="physical">Physical Persons</option>
            <option value="juridical">Juridical Persons (SME)</option>
            <option value="representatives">Representatives</option>
            <option value="accumulated">Accumulated Accounts</option>
          </select>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn-success" onclick="openCreateModal()">+ Add Record</button>
          <button class="btn btn-secondary" onclick="refreshDbViewer()">Refresh DB</button>
          <button class="btn btn-secondary" onclick="exportDbJson()">Download JSON</button>
          <button class="btn btn-danger" onclick="resetDb()">Reset to Seed</button>
        </div>
      </div>
      <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
        Database state is synced on disk at: <code style="color: var(--accent-blue);">db.json</code>. You can directly edit any record using the <strong>Edit</strong> button.
      </div>
      <div id="table-display" class="table-container">Loading table data...</div>
    </div>

    <div class="card" style="margin-top: 24px;">
      <div class="card-title">
        <span id="record-inspector-title">Record Details Inspector</span>
        <div id="inspector-actions" style="display: none;">
          <button class="btn btn-sm btn-primary" onclick="editInspectedRecord()">Edit This Record</button>
          <button class="btn btn-sm btn-danger" onclick="deleteInspectedRecord()">Delete Record</button>
        </div>
      </div>
      <div id="record-inspector" class="terminal">// Click any row in the table above to view and edit its full JSON document...</div>
    </div>
  </div>

  <!-- TAB 2: API EXPLORER -->
  <div id="tab-content-api" style="display: none;">
    <div class="main-grid">
      <div class="card">
        <div class="card-title">
          <span>Click Any Endpoint to Test Live</span>
          <span style="font-size: 12px; color: var(--text-muted); font-weight: normal;">All 21 endpoints</span>
        </div>
        <div class="endpoint-list">
          <div class="endpoint-item" onclick="testEndpoint('POST', '/transact/sync-customer', { personalCode: '38501010001' })">
            <div><span class="method-tag method-post">POST</span>/transact/sync-customer</div>
            <span style="color: var(--text-muted); font-size: 11px;">Sync customer to Transact T24</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/physical/by-personal-code/38501010001')">
            <div><span class="method-tag method-get">GET</span>/persons/physical/by-personal-code/:code</div>
            <span style="color: var(--text-muted); font-size: 11px;">Lookup customer by PersonalCode</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/physical')">
            <div><span class="method-tag method-get">GET</span>/persons/physical</div>
            <span style="color: var(--text-muted); font-size: 11px;">Search physical persons</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/physical/F20014528')">
            <div><span class="method-tag method-get">GET</span>/persons/physical/F20014528</div>
            <span style="color: var(--text-muted); font-size: 11px;">Get Jonas Kazlauskas</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/physical/F20014530/potentialGuardians')">
            <div><span class="method-tag method-get">GET</span>/persons/physical/F20014530/potentialGuardians</div>
            <span style="color: var(--text-muted); font-size: 11px;">Get junior guardians</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/physical/F20014528/children')">
            <div><span class="method-tag method-get">GET</span>/persons/physical/F20014528/children</div>
            <span style="color: var(--text-muted); font-size: 11px;">Get client's children</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('POST', '/persons/physical', sampleProspect)">
            <div><span class="method-tag method-post">POST</span>/persons/physical</div>
            <span style="color: var(--text-muted); font-size: 11px;">Create physical prospect</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('POST', '/persons/physical/F20014528/consent', { ConsentOffers: true, ConsentProfiling: true, ConsentPartnersOffers: true })">
            <div><span class="method-tag method-post">POST</span>/persons/physical/F20014528/consent</div>
            <span style="color: var(--text-muted); font-size: 11px;">Update consents</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/juridical')">
            <div><span class="method-tag method-get">GET</span>/persons/juridical</div>
            <span style="color: var(--text-muted); font-size: 11px;">Search SME clients</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/juridical/J20014528')">
            <div><span class="method-tag method-get">GET</span>/persons/juridical/J20014528</div>
            <span style="color: var(--text-muted); font-size: 11px;">Get juridical person</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/juridical/accumulated')">
            <div><span class="method-tag method-get">GET</span>/persons/juridical/accumulated</div>
            <span style="color: var(--text-muted); font-size: 11px;">Search accumulated acc.</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/juridical/J20014528/representatives/R3001')">
            <div><span class="method-tag method-get">GET</span>/persons/juridical/J20014528/representatives/R3001</div>
            <span style="color: var(--text-muted); font-size: 11px;">Validate legal rep</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/representatives')">
            <div><span class="method-tag method-get">GET</span>/persons/representatives</div>
            <span style="color: var(--text-muted); font-size: 11px;">Search representatives</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/representatives/R3001')">
            <div><span class="method-tag method-get">GET</span>/persons/representatives/R3001</div>
            <span style="color: var(--text-muted); font-size: 11px;">Get representative R3001</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          <span id="response-title">Live Response Console</span>
          <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px;" onclick="clearConsole()">Clear</button>
        </div>
        <div id="console-output" class="terminal">// Select an endpoint on the left or use Swagger UI to view live API response...</div>
      </div>
    </div>
  </div>

  <!-- EDIT / CREATE MODAL -->
  <div id="edit-modal" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <h3 id="modal-title">Edit Record</h3>
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <span>Modify JSON below. Changes are saved immediately to in-memory state and synced to <code style="color:var(--accent-blue)">db.json</code>.</span>
          <button type="button" class="btn btn-sm btn-primary" id="modal-randomize-btn" onclick="randomizeModalPayload()" style="display:none; font-size:11px; padding:4px 10px; background:#0284c7;">🎲 Randomize Data</button>
        </div>
        <textarea id="modal-json-editor" class="json-editor" spellcheck="false"></textarea>
        <div id="modal-error" style="color: #f87171; font-size: 12px; margin-top: 8px; display: none;"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-success" id="modal-save-btn" onclick="saveModalChanges()">Save Changes</button>
      </div>
    </div>
  </div> <!-- /#system-content-mcd -->

  <!-- SYSTEM 2: FORMPIPE LASERNET -->
  <div id="system-content-formpipe" style="display: none;">
    <!-- Formpipe Banner -->
    <div class="formpipe-banner">
      <div class="formpipe-banner-header">
        <div class="formpipe-banner-title">
          <span style="font-size:22px;">📄</span>
          <span>Formpipe LaserNet Document Services</span>
          <span class="badge" style="background: rgba(147, 115, 238, 0.2); color: var(--primary); font-family: monospace;">v1 Adapter</span>
        </div>
        <div class="formpipe-meta-pills">
          <span class="meta-pill">Port: ${PORT}</span>
          <span class="meta-pill">Auth: AccessKey</span>
          <span class="meta-pill" style="color:var(--accent-green); background:rgba(16,185,129,0.15);">● Server Active</span>
          <a href="/docs#/formpipe" target="_blank" class="btn btn-sm btn-secondary" style="font-size:11px; padding:4px 8px;">Swagger Formpipe Docs</a>
        </div>
      </div>
      <div style="font-size:13px; color:var(--text-muted); line-height:1.5;">
        Complete Formpipe LaserNet document adapter emulation suite. Generate dynamic contracts, produce raw binary PDF byte arrays, and fetch generated document files with full Base64 / PDF format inspection.
      </div>
    </div>

    <!-- 3 Formpipe Testing Cards Grid -->
    <div class="formpipe-cards-grid">
      
      <!-- API 1 CARD -->
      <div class="formpipe-card">
        <div class="formpipe-card-header">
          <div class="formpipe-endpoint-badge">
            <span class="method-tag method-post">POST</span>
            <span>/formpipe-adapter/v1/document-generation/generate</span>
          </div>
          <span style="font-size:12px; color:var(--text-muted); font-family:monospace;">Returns: JSON (DocID & DMLink)</span>
        </div>
        <div style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
          Submits template payload to LaserNet and creates the document job. Always returns status <code>200 OK</code>, generated <code>DocID: 64424517880</code>, and direct <code>DMLink</code> URL.
        </div>
        
        <div style="display:grid; grid-template-columns: 1fr 2fr; gap:12px; margin-bottom:12px;">
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase;">AccessKey Header</label>
            <input type="text" id="formpipe-api1-key" value="p32lUv6H-yyP2biBL-qn8zXUJO-RE/2tdqE" style="width:100%; padding:8px 12px; margin-top:4px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:6px; color:var(--input-color); font-family:monospace; font-size:12px;">
          </div>
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase;">Target URL</label>
            <input type="text" readonly id="formpipe-api1-url" value="/formpipe-adapter/v1/document-generation/generate" style="width:100%; padding:8px 12px; margin-top:4px; background:var(--card-inner); border:1px solid var(--border); border-radius:6px; color:var(--text-muted); font-family:monospace; font-size:12px;">
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase;">Request Body (JSON)</label>
          <button class="btn btn-secondary btn-sm" onclick="resetFormpipePayload('formpipe-payload-api1')" style="font-size:11px; padding:3px 8px;">Reset Sample Payload</button>
        </div>
        <textarea id="formpipe-payload-api1" class="formpipe-payload-box" spellcheck="false"></textarea>

        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:16px;">
          <button class="btn btn-primary" onclick="testFormpipeGenerate()">
            <span>🚀 Send Request (POST /generate)</span>
          </button>
          <button class="btn btn-secondary" onclick="copyFormpipeCurl('generate')">
            <span>📋 Copy cURL</span>
          </button>
          <span id="formpipe-api1-status" style="font-size:12px; font-weight:600; font-family:monospace;"></span>
        </div>

        <div>
          <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase;">Response Output</label>
          <pre id="formpipe-api1-response" class="terminal" style="max-height:220px; margin-top:4px;">// Click "Send Request" to test API 1</pre>
        </div>
      </div>

      <!-- API 2 CARD -->
      <div class="formpipe-card">
        <div class="formpipe-card-header">
          <div class="formpipe-endpoint-badge">
            <span class="method-tag method-post">POST</span>
            <span>/formpipe-adapter/v1/document-generation/documentonly</span>
          </div>
          <span style="font-size:12px; color:var(--accent-blue); font-family:monospace; font-weight:600;">Returns: Binary PDF Byte Array</span>
        </div>
        <div style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
          Synchronously generates and streams the complete 4-page banking service contract as a raw binary PDF byte array (<code>Content-Type: application/pdf</code>, 147.69 KB).
        </div>

        <div style="display:grid; grid-template-columns: 1fr 2fr; gap:12px; margin-bottom:12px;">
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase;">AccessKey Header</label>
            <input type="text" id="formpipe-api2-key" value="p32lUv6H-yyP2biBL-qn8zXUJO-RE/2tdqE" style="width:100%; padding:8px 12px; margin-top:4px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:6px; color:var(--input-color); font-family:monospace; font-size:12px;">
          </div>
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase;">Target URL</label>
            <input type="text" readonly id="formpipe-api2-url" value="/formpipe-adapter/v1/document-generation/documentonly" style="width:100%; padding:8px 12px; margin-top:4px; background:var(--card-inner); border:1px solid var(--border); border-radius:6px; color:var(--text-muted); font-family:monospace; font-size:12px;">
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase;">Request Body (JSON)</label>
          <button class="btn btn-secondary btn-sm" onclick="resetFormpipePayload('formpipe-payload-api2')" style="font-size:11px; padding:3px 8px;">Reset Sample Payload</button>
        </div>
        <textarea id="formpipe-payload-api2" class="formpipe-payload-box" spellcheck="false"></textarea>

        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:16px;">
          <button class="btn btn-primary" onclick="testFormpipeDocumentOnly()">
            <span>📄 Send Request & Retrieve PDF</span>
          </button>
          <button class="btn btn-secondary" id="btn-download-api2" onclick="downloadApi2Pdf()" style="display:none;">
            <span>⬇️ Download PDF (147 KB)</span>
          </button>
          <button class="btn btn-secondary" id="btn-toggle-preview-api2" onclick="toggleApi2Preview()" style="display:none;">
            <span>👁️ Toggle Live Preview</span>
          </button>
          <button class="btn btn-secondary" onclick="copyFormpipeCurl('documentonly')">
            <span>📋 Copy cURL</span>
          </button>
          <span id="formpipe-api2-status" style="font-size:12px; font-weight:600; font-family:monospace;"></span>
        </div>

        <div>
          <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase;">Response Details & PDF Inspection</label>
          <pre id="formpipe-api2-response" class="terminal" style="max-height:160px; margin-top:4px;">// Click "Send Request & Retrieve PDF" to test API 2</pre>
          <iframe id="formpipe-api2-iframe" class="pdf-preview-box"></iframe>
        </div>
      </div>

      <!-- API 3 CARD -->
      <div class="formpipe-card">
        <div class="formpipe-card-header">
          <div class="formpipe-endpoint-badge">
            <span class="method-tag method-get">GET</span>
            <span>/formpipe-adapter/v1/documents/by-id/{id}/file</span>
          </div>
          <span style="font-size:12px; color:var(--accent-purple); font-family:monospace; font-weight:600;">Returns: PDF Base64 String</span>
        </div>
        <div style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
          Retrieves the generated document for any given Document ID. Returns the complete Base64 encoded PDF string (196,920 chars). Also supports direct download or browser viewing via <code>?format=pdf</code>.
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:12px; margin-bottom:12px;">
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase;">Document ID</label>
            <input type="text" id="formpipe-api3-id" value="68719477778" style="width:100%; padding:8px 12px; margin-top:4px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:6px; color:var(--input-color); font-family:monospace; font-size:13px; font-weight:600;">
          </div>
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase;">AccessKey Header</label>
            <input type="text" id="formpipe-api3-key" value="p32lUv6H-yyP2biBL-qn8zXUJO-RE/2tdqE" style="width:100%; padding:8px 12px; margin-top:4px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:6px; color:var(--input-color); font-family:monospace; font-size:12px;">
          </div>
          <div>
            <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase;">Response Format</label>
            <select id="formpipe-api3-format" style="width:100%; padding:8px 12px; margin-top:4px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:6px; color:var(--input-color); font-size:12px;">
              <option value="raw" selected>Base64 String (Default)</option>
              <option value="json">JSON { status, DocID, file }</option>
              <option value="pdf">Binary PDF (?format=pdf)</option>
            </select>
          </div>
        </div>

        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:16px;">
          <button class="btn btn-primary" onclick="testFormpipeGetFile()">
            <span>📥 Fetch Document File (GET /file)</span>
          </button>
          <button class="btn btn-secondary" id="btn-download-api3" onclick="downloadApi3Pdf()" style="display:none;">
            <span>⬇️ Download Decoded PDF</span>
          </button>
          <button class="btn btn-secondary" id="btn-toggle-preview-api3" onclick="toggleApi3Preview()" style="display:none;">
            <span>👁️ Toggle Live Preview</span>
          </button>
          <button class="btn btn-secondary" onclick="copyFormpipeCurl('getfile')">
            <span>📋 Copy cURL</span>
          </button>
          <span id="formpipe-api3-status" style="font-size:12px; font-weight:600; font-family:monospace;"></span>
        </div>

        <div>
          <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase;">Response Base64 Content</label>
          <pre id="formpipe-api3-response" class="terminal" style="max-height:200px; margin-top:4px;">// Click "Fetch Document File" to test API 3</pre>
          <iframe id="formpipe-api3-iframe" class="pdf-preview-box"></iframe>
        </div>
      </div>

    </div>
  </div> <!-- /#system-content-formpipe -->

  <script>
    let dbData = null;
    let currentTable = 'physical';
    let currentlyInspected = null;
    let modalMode = 'edit'; // 'edit' or 'create'
    let modalRecordId = null;

    async function loadDatabase() {
      try {
        const res = await fetch('/admin/db');
        dbData = await res.json();
        document.getElementById('count-physical').innerText = dbData.physicalPersons.length;
        document.getElementById('count-juridical').innerText = dbData.juridicalPersons.length;
        document.getElementById('count-rep').innerText = dbData.representatives.length;
        document.getElementById('count-acc').innerText = dbData.accumulatedJuridicalPersons.length;
        renderTable();
        updateCustomerSelector();
      } catch (err) {
        console.error('Failed to load DB:', err);
      }
    }

    function updateCustomerSelector() {
      const select = document.getElementById('sync-customer-select');
      if (!select || !dbData || !dbData.physicalPersons) return;
      const currentVal = document.getElementById('sync-personal-code').value;
      let optionsHtml = '<option value="">-- Or pick customer to sync --</option>';
      dbData.physicalPersons.forEach(p => {
        const tIdVal = p.transactID || p.TransactID || p.transactId || p.TransactId;
        const tId = tIdVal ? (' [Transact: ' + tIdVal + ']') : ' [Not Synced]';
        const code = p.personalCode || p.PersonalCode || '';
        const name = (p.firstName || p.FirstName || '') + ' ' + (p.lastName || p.LastName || '');
        const id = p.mcdId || p.McdId || '';
        optionsHtml += '<option value="' + code + '" ' + (code === currentVal ? 'selected' : '') + '>' + id + ': ' + name + ' (' + (code || 'No Code') + ')' + tId + '</option>';
      });
      select.innerHTML = optionsHtml;
    }

    function switchTable(name) {
      currentTable = name;
      document.getElementById('table-selector').value = name;
      const titles = {
        physical: 'Physical Persons',
        juridical: 'Juridical Persons (SME)',
        representatives: 'Representatives',
        accumulated: 'Accumulated Accounts'
      };
      document.getElementById('current-table-title').innerText = 'Table: ' + titles[name];
      renderTable();
    }

    function getRecord(col, id) {
      if (!dbData) return null;
      var list = [];
      if (col === 'physical') list = dbData.physicalPersons || [];
      else if (col === 'juridical') list = dbData.juridicalPersons || [];
      else if (col === 'representatives') list = dbData.representatives || [];
      else if (col === 'accumulated') list = dbData.accumulatedJuridicalPersons || [];
      for (var i = 0; i < list.length; i++) {
        if ((list[i].mcdId || list[i].McdId) === id) return list[i];
      }
      return null;
    }

    function selectRecord(col, id) {
      var rec = getRecord(col, id);
      if (rec) inspectRecord(rec);
    }

    function openEditById(col, id) {
      var rec = getRecord(col, id);
      if (rec) openEditModal(col, id, rec);
    }

    function renderTable() {
      if (!dbData) return;
      var container = document.getElementById('table-display');
      var html = '';

      if (currentTable === 'physical') {
        html = '<table><thead><tr><th>MCD ID</th><th>Full Name</th><th>Personal Code</th><th>Transact ID</th><th>Status</th><th>Email</th><th>Phone</th><th>Guardian / Minor</th><th>Actions</th></tr></thead><tbody>';
        var pList = dbData.physicalPersons || [];
        for (var i = 0; i < pList.length; i++) {
          var p = pList[i];
          var id = p.mcdId || p.McdId || '';
          var status = p.status || p.Status || 'Prospect';
          var badgeClass = status === 'Existing' ? 'badge-existing' : 'badge-prospect';
          var isMinor = Boolean(p.isMinor !== undefined ? p.isMinor : p.IsMinor);
          var minorTag = isMinor ? '<span style="color:var(--accent-orange)">Yes (Minor)</span>' : 'No';
          var fName = p.firstName || p.FirstName || '';
          var lName = p.lastName || p.LastName || '';
          var pCode = p.personalCode || p.PersonalCode || '-';
          var tIdVal = p.transactID || p.TransactID || p.transactId || p.TransactId;
          var tIdSpan = tIdVal ? ('<span style="background:rgba(56,189,248,0.15); color:#38bdf8; padding:3px 8px; border-radius:4px; font-weight:600; font-family:monospace;">' + tIdVal + '</span>') : '<span style="color:var(--text-muted); font-size:12px;">None</span>';
          var email = p.primaryEmail || p.PrimaryEmail || '-';
          var phone = p.primaryPhoneNumber || p.PrimaryPhoneNumber || '-';
          var gId = p.guardianMcdId || p.GuardianMcdId;
          html += '<tr data-col="physical" data-id="' + id + '" style="cursor:pointer;">' +
            '<td><strong style="color:var(--accent-blue)">' + id + '</strong></td>' +
            '<td>' + fName + ' ' + lName + '</td>' +
            '<td>' + pCode + '</td>' +
            '<td>' + tIdSpan + '</td>' +
            '<td><span class="badge ' + badgeClass + '">' + status + '</span></td>' +
            '<td>' + email + '</td>' +
            '<td>' + phone + '</td>' +
            '<td>' + minorTag + (gId ? ' (Guardian: ' + gId + ')' : '') + '</td>' +
            '<td><div style="display:flex; gap:6px; align-items:center;">' +
              (pCode !== '-' ? '<button class="btn btn-sm btn-sync" data-code="' + pCode + '" style="background:#0284c7; color:#fff;" title="Sync customer to Transact">⚡ Sync</button>' : '') +
              '<button class="btn btn-sm btn-primary btn-edit">Edit</button>' +
              '<button class="btn btn-sm btn-danger btn-delete">Delete</button>' +
            '</div></td>' +
          '</tr>';
        }
        html += '</tbody></table>';
      } else if (currentTable === 'juridical') {
        html = '<table><thead><tr><th>MCD ID</th><th>Company Name</th><th>Company Code</th><th>Status</th><th>Email</th><th>Phone</th><th>Legal Representative</th><th>Actions</th></tr></thead><tbody>';
        var jList = dbData.juridicalPersons || [];
        for (var j = 0; j < jList.length; j++) {
          var jItem = jList[j];
          var jId = jItem.mcdId || jItem.McdId || '';
          var jStatus = jItem.status || jItem.Status || 'Prospect';
          var badgeClass = jStatus === 'Existing' ? 'badge-existing' : 'badge-prospect';
          html += '<tr data-col="juridical" data-id="' + jId + '" style="cursor:pointer;">' +
            '<td><strong style="color:var(--accent-blue)">' + jId + '</strong></td>' +
            '<td>' + (jItem.fullName || jItem.FullName || '-') + '</td>' +
            '<td>' + (jItem.companyCode || jItem.CompanyCode || '-') + '</td>' +
            '<td><span class="badge ' + badgeClass + '">' + jStatus + '</span></td>' +
            '<td>' + (jItem.primaryEmail || jItem.PrimaryEmail || '-') + '</td>' +
            '<td>' + (jItem.primaryPhoneNumber || jItem.PrimaryPhoneNumber || '-') + '</td>' +
            '<td>' + (jItem.representativeMcdId || jItem.RepresentativeMcdId || '-') + '</td>' +
            '<td><div style="display:flex; gap:6px;">' +
              '<button class="btn btn-sm btn-primary btn-edit">Edit</button>' +
              '<button class="btn btn-sm btn-danger btn-delete">Delete</button>' +
            '</div></td>' +
          '</tr>';
        }
        html += '</tbody></table>';
      } else if (currentTable === 'representatives') {
        html = '<table><thead><tr><th>MCD ID</th><th>Full Name</th><th>Personal Code</th><th>Country</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead><tbody>';
        var rList = dbData.representatives || [];
        for (var r = 0; r < rList.length; r++) {
          var rItem = rList[r];
          var rId = rItem.mcdId || rItem.McdId || '';
          html += '<tr data-col="representatives" data-id="' + rId + '" style="cursor:pointer;">' +
            '<td><strong style="color:var(--accent-blue)">' + rId + '</strong></td>' +
            '<td>' + (rItem.firstName || rItem.FirstName || '') + ' ' + (rItem.lastName || rItem.LastName || '') + '</td>' +
            '<td>' + (rItem.personalCode || rItem.PersonalCode || '-') + '</td>' +
            '<td>' + (rItem.countryCode || rItem.CountryCode || '-') + '</td>' +
            '<td>' + (rItem.primaryEmail || rItem.PrimaryEmail || '-') + '</td>' +
            '<td>' + (rItem.primaryPhoneNumber || rItem.PrimaryPhoneNumber || '-') + '</td>' +
            '<td><div style="display:flex; gap:6px;">' +
              '<button class="btn btn-sm btn-primary btn-edit">Edit</button>' +
              '<button class="btn btn-sm btn-danger btn-delete">Delete</button>' +
            '</div></td>' +
          '</tr>';
        }
        html += '</tbody></table>';
      } else if (currentTable === 'accumulated') {
        html = '<table><thead><tr><th>MCD ID</th><th>Proposed Name</th><th>Temporary Code</th><th>Representative</th><th>Phone</th><th>Actions</th></tr></thead><tbody>';
        var aList = dbData.accumulatedJuridicalPersons || [];
        for (var a = 0; a < aList.length; a++) {
          var aItem = aList[a];
          var aId = aItem.mcdId || aItem.McdId || '';
          html += '<tr data-col="accumulated" data-id="' + aId + '" style="cursor:pointer;">' +
            '<td><strong style="color:var(--accent-blue)">' + aId + '</strong></td>' +
            '<td>' + (aItem.fullName || aItem.FullName || '-') + '</td>' +
            '<td>' + (aItem.companyCode || aItem.CompanyCode || '-') + '</td>' +
            '<td>' + (aItem.representativeMcdId || aItem.RepresentativeMcdId || '-') + '</td>' +
            '<td>' + (aItem.phoneNumber || aItem.PhoneNumber || '-') + '</td>' +
            '<td><div style="display:flex; gap:6px;">' +
              '<button class="btn btn-sm btn-primary btn-edit">Edit</button>' +
              '<button class="btn btn-sm btn-danger btn-delete">Delete</button>' +
            '</div></td>' +
          '</tr>';
        }
        html += '</tbody></table>';
      }

      container.innerHTML = html;
    }

    function inspectRecord(record) {
      currentlyInspected = record;
      const id = record.mcdId || record.McdId || '';
      const title = record.fullName || record.FullName || ((record.firstName || record.FirstName || '') + ' ' + (record.lastName || record.LastName || ''));
      document.getElementById('record-inspector-title').innerText = 'Record: ' + id + ' (' + title + ')';
      document.getElementById('record-inspector').innerText = JSON.stringify(record, null, 2);
      document.getElementById('inspector-actions').style.display = 'flex';
      document.getElementById('inspector-actions').style.gap = '8px';
    }

    function editInspectedRecord() {
      if (currentlyInspected) {
        openEditModal(currentTable, currentlyInspected.McdId, currentlyInspected);
      }
    }

    function deleteInspectedRecord() {
      if (currentlyInspected) {
        deleteRecord(currentTable, currentlyInspected.McdId);
      }
    }

    // Modal Editor Functions
    function openEditModal(col, id, record) {
      modalMode = 'edit';
      modalRecordId = id;
      document.getElementById('modal-title').innerText = 'Edit ' + id + ' (' + col + ')';
      document.getElementById('modal-json-editor').value = JSON.stringify(record, null, 2);
      document.getElementById('modal-error').style.display = 'none';
      const rBtn = document.getElementById('modal-randomize-btn');
      if (rBtn) rBtn.style.display = 'none';
      document.getElementById('edit-modal').style.display = 'flex';
    }

    function getRandomItem(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateRandomPhysicalRecord() {
      const maleFirst = ['Lukas', 'Mantas', 'Tomas', 'Dovydas', 'Matas', 'Jonas', 'Paulius', 'Arnas', 'Rytis', 'Gediminas', 'Tadas', 'Mindaugas', 'Karolis', 'Vytautas', 'Andrius'];
      const femaleFirst = ['Emilija', 'Gabija', 'Kamile', 'Ugne', 'Laura', 'Ieva', 'Austeja', 'Greta', 'Karolina', 'Egle', 'Viktorija', 'Dovile', 'Ruta', 'Simona', 'Justina'];
      const lastNames = ['Kazlauskas', 'Jankauskas', 'Petrauskas', 'Stankevicius', 'Vasiliauskas', 'Zukauskas', 'Urbonas', 'Kavaliauskas', 'Navickas', 'Balciunas', 'Vaitkus', 'Zemaitis', 'Paulauskas', 'Lukauskas', 'Adomaitis'];
      const streets = ['Gedimino pr.', 'Konstitucijos pr.', 'Pilies g.', 'Vilniaus g.', 'Ozo g.', 'Saltoniskiu g.', 'Ukmerges g.', 'Savanoriu pr.', 'Didzioji g.', 'Vokieciu g.'];
      const cities = ['Vilnius', 'Kaunas', 'Klaipeda'];

      const isMale = Math.random() > 0.5;
      const firstName = isMale ? getRandomItem(maleFirst) : getRandomItem(femaleFirst);
      const lastName = getRandomItem(lastNames);

      const birthYear = Math.floor(1975 + Math.random() * 28);
      const birthMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
      const birthDay = String(Math.floor(1 + Math.random() * 28)).padStart(2, '0');
      const dob = birthYear + '-' + birthMonth + '-' + birthDay;

      let genderDigit = '3';
      if (birthYear >= 2000) {
        genderDigit = isMale ? '5' : '6';
      } else {
        genderDigit = isMale ? '3' : '4';
      }
      const yy = String(birthYear).slice(-2);
      const rand4 = String(Math.floor(1000 + Math.random() * 9000));
      const personalCode = genderDigit + yy + birthMonth + birthDay + rand4;

      const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
      const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
      const email = cleanFirst + '.' + cleanLast + Math.floor(10 + Math.random() * 90) + '@example.lt';
      const phone = '+3706' + Math.floor(1000000 + Math.random() * 9000000);

      const city = getRandomItem(cities);
      const street = getRandomItem(streets);
      const bldg = Math.floor(1 + Math.random() * 99);
      const flat = Math.floor(1 + Math.random() * 45);

      const ssnArea = String(Math.floor(100 + Math.random() * 899));
      const ssnGroup = String(Math.floor(10 + Math.random() * 89));
      const ssnSerial = String(Math.floor(1000 + Math.random() * 8999));
      const ssn = ssnArea + '-' + ssnGroup + '-' + ssnSerial;

      return {
        FirstName: firstName,
        LastName: lastName,
        PersonalCode: personalCode,
        Ssn: ssn,
        CountryCode: "LT",
        Gender: isMale ? "MALE" : "FEMALE",
        Status: "Prospect",
        DateOfBirth: dob,
        PrimaryEmail: email,
        PrimaryEmailVerified: true,
        PrimaryPhoneNumber: phone,
        PrimaryPhoneNumberVerified: true,
        RegistrationAddress: {
          countryCode: "LT",
          city: city,
          street: street + ' ' + bldg + '-' + flat,
          postCode: String(Math.floor(10000 + Math.random() * 89000))
        },
        SelectedProducts: [
          { ProductCategory: "ACCOUNTS", ProductId: getRandomItem(["STANDARD", "PREMIUM", "CURRENT_ACCOUNT_STANDARD"]) }
        ]
      };
    }

    function generateRandomJuridicalRecord() {
      const prefixes = ['UAB Baltic', 'UAB Nordic', 'UAB Apex', 'UAB Inovaciju', 'UAB Tech', 'UAB Venture', 'UAB Global', 'UAB Future', 'UAB Prime'];
      const suffixes = ['Solutions', 'Group', 'Logistika', 'Sistemos', 'Prekyba', 'Verslas', 'Technologies', 'Consulting'];
      const name = getRandomItem(prefixes) + ' ' + getRandomItem(suffixes);
      const code = '30' + Math.floor(1000000 + Math.random() * 9000000);
      const clean = name.toLowerCase().replace(/[^a-z]/g, '');
      return {
        FullName: name,
        CompanyCode: code,
        CountryCode: "LT",
        Status: "Prospect",
        PrimaryEmail: 'info@' + clean.slice(0, 10) + '.lt',
        PrimaryPhoneNumber: '+3705' + Math.floor(2000000 + Math.random() * 7000000),
        RepresentativeMcdId: "R3001"
      };
    }

    function generateRandomRepRecord() {
      const firstNames = ['Vytautas', 'Jurgis', 'Tomas', 'Mindaugas', 'Saulius', 'Dainius'];
      const lastNames = ['Didziulis', 'Petrauskas', 'Vaitkus', 'Kuzminskas', 'Kazlauskas'];
      const first = getRandomItem(firstNames);
      const last = getRandomItem(lastNames);
      const rand4 = String(Math.floor(1000 + Math.random() * 9000));
      return {
        FirstName: first,
        LastName: last,
        PersonalCode: '38' + Math.floor(10 + Math.random() * 80) + '0101' + rand4,
        CountryCode: "LT",
        PrimaryEmail: first.toLowerCase() + '.' + last.toLowerCase() + '@verslas.lt',
        PrimaryPhoneNumber: '+370600' + Math.floor(10000 + Math.random() * 89000),
        Status: "Existing"
      };
    }

    function generateRandomAccRecord() {
      const code = 'EST-' + Math.floor(100000 + Math.random() * 900000);
      const words = ['Inovacija', 'Ateitis', 'Projektas', 'Startas', 'Platforma'];
      return {
        FullName: 'UAB Steigiama ' + getRandomItem(words),
        CompanyCode: code,
        CountryCode: "LT",
        Status: "Prospect",
        RepresentativeMcdId: "R3001",
        phoneNumber: '+370600' + Math.floor(10000 + Math.random() * 89000)
      };
    }

    function getRandomTemplate(type) {
      if (type === 'physical') return generateRandomPhysicalRecord();
      if (type === 'juridical') return generateRandomJuridicalRecord();
      if (type === 'representatives') return generateRandomRepRecord();
      return generateRandomAccRecord();
    }

    function openCreateModal() {
      modalMode = 'create';
      modalRecordId = null;
      document.getElementById('modal-title').innerText = 'Add New Record (' + currentTable + ')';
      const template = getRandomTemplate(currentTable);
      document.getElementById('modal-json-editor').value = JSON.stringify(template, null, 2);
      document.getElementById('modal-error').style.display = 'none';
      const rBtn = document.getElementById('modal-randomize-btn');
      if (rBtn) rBtn.style.display = 'inline-block';
      document.getElementById('edit-modal').style.display = 'flex';
    }

    function randomizeModalPayload() {
      if (modalMode === 'create') {
        const template = getRandomTemplate(currentTable);
        document.getElementById('modal-json-editor').value = JSON.stringify(template, null, 2);
        document.getElementById('modal-error').style.display = 'none';
        showToast('Generated fresh random payload!');
      }
    }

    function closeModal() {
      document.getElementById('edit-modal').style.display = 'none';
    }

    async function saveModalChanges() {
      const editor = document.getElementById('modal-json-editor');
      const errBox = document.getElementById('modal-error');
      let payload;
      try {
        payload = JSON.parse(editor.value);
      } catch (e) {
        errBox.innerText = 'Invalid JSON: ' + e.message;
        errBox.style.display = 'block';
        return;
      }

      try {
        let url = '/admin/db/' + currentTable;
        let method = 'POST';
        if (modalMode === 'edit') {
          url += '/' + modalRecordId;
          method = 'PUT';
        }

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (res.ok) {
          closeModal();
          showToast(result.message || 'Saved successfully!');
          await loadDatabase();
          if (modalMode === 'edit' && currentlyInspected && (currentlyInspected.mcdId || currentlyInspected.McdId) === modalRecordId) {
            inspectRecord(result.record || payload);
          }
        } else {
          errBox.innerText = result.errorMessage || result.ErrorMessage || 'Failed to save';
          errBox.style.display = 'block';
        }
      } catch (err) {
        errBox.innerText = 'Network error: ' + err.message;
        errBox.style.display = 'block';
      }
    }

    async function deleteRecord(col, id) {
      if (!confirm('Are you sure you want to delete ' + id + ' from ' + col + '?')) return;
      try {
        const res = await fetch('/admin/db/' + col + '/' + id, { method: 'DELETE' });
        const result = await res.json();
        if (res.ok) {
          showToast('Deleted ' + id);
          if (currentlyInspected && (currentlyInspected.mcdId || currentlyInspected.McdId) === id) {
            currentlyInspected = null;
            document.getElementById('record-inspector-title').innerText = 'Record Details Inspector';
            document.getElementById('record-inspector').innerText = '// Record deleted.';
            document.getElementById('inspector-actions').style.display = 'none';
          }
          await loadDatabase();
        } else {
          alert('Delete failed: ' + (result.errorMessage || result.ErrorMessage || 'Unknown error'));
        }
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.innerText = '✅ ' + msg;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }

    function setMainTab(tab) {
      document.getElementById('tab-btn-db').className = 'tab-btn' + (tab === 'db' ? ' active' : '');
      document.getElementById('tab-btn-api').className = 'tab-btn' + (tab === 'api' ? ' active' : '');
      document.getElementById('tab-content-db').style.display = tab === 'db' ? 'block' : 'none';
      document.getElementById('tab-content-api').style.display = tab === 'api' ? 'block' : 'none';
    }

    async function refreshDbViewer() {
      await loadDatabase();
      showToast('Database refreshed!');
    }

    function exportDbJson() {
      window.open('/admin/db', '_blank');
    }

    async function resetDb() {
      if (confirm('Reset database to default test entities?')) {
        await fetch('/admin/db/reset', { method: 'POST' });
        await loadDatabase();
        showToast('Database reset to defaults');
      }
    }

    // API Explorer Logic
    const sampleProspect = {
      firstName: "Dovile",
      lastName: "Naujokaite",
      personalCode: "49208080008",
      countryCode: "LT",
      dateOfBirth: "1992-08-08",
      email: "dovile.n@example.com",
      emailVerified: true,
      phoneNumber: "+37061122334",
      phoneNumberVerified: true,
      selectedProducts: [{ ProductCategory: "ACCOUNTS", ProductId: "CURRENT_ACCOUNT_STANDARD" }]
    };

    async function testEndpoint(method, path, body) {
      const output = document.getElementById('console-output');
      const title = document.getElementById('response-title');
      title.innerText = 'Requesting: ' + method + ' ' + path + '...';
      output.innerText = 'Sending request to ' + path + '...\\n';

      const start = performance.now();
      try {
        const opts = { method, headers: { 'Accept': 'application/json' } };
        if (body) {
          opts.headers['Content-Type'] = 'application/json';
          opts.body = JSON.stringify(body);
        }
        const res = await fetch(path, opts);
        const time = (performance.now() - start).toFixed(1);
        const data = await res.json();

        title.innerText = method + ' ' + path + ' (' + res.status + ' ' + res.statusText + ' in ' + time + 'ms)';
        output.innerText = '// Status: ' + res.status + ' ' + res.statusText + ' (' + time + 'ms)\\n// Method: ' + method + ' ' + path + '\\n\\n' + JSON.stringify(data, null, 2);
        loadDatabase(); // refresh DB view
      } catch (err) {
        output.innerText = '// Request failed: ' + err.message;
      }
    }

    function clearConsole() {
      document.getElementById('console-output').innerText = '// Console cleared.';
      document.getElementById('response-title').innerText = 'Live Response Console';
    }

    async function triggerTransactSync() {
      const codeInput = document.getElementById('sync-personal-code');
      const alertBox = document.getElementById('transact-sync-alert');
      const btn = document.getElementById('btn-transact-sync');
      const code = codeInput ? codeInput.value.trim() : '';

      if (!code) {
        alert('Please enter a Personal Code');
        return;
      }

      btn.disabled = true;
      btn.innerText = 'Calling Transact...';
      alertBox.style.display = 'block';
      alertBox.style.background = 'rgba(56,189,248,0.1)';
      alertBox.style.color = '#38bdf8';
      alertBox.style.border = '1px solid rgba(56,189,248,0.3)';
      alertBox.innerText = 'Calling Transact API at 192.168.1.157:8085 for PersonalCode: ' + code + '...';

      try {
        const res = await fetch('/transact/sync-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ personalCode: code })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          if (data.alreadySynced) {
            alertBox.style.background = 'rgba(234,179,8,0.15)';
            alertBox.style.color = '#facc15';
            alertBox.style.border = '1px solid rgba(234,179,8,0.4)';
            alertBox.innerText = 'ℹ️ ' + (data.message || ('Customer already has TransactID: ' + data.transactId));
            showToast('Customer already has TransactID: ' + data.transactId);
          } else {
            alertBox.style.background = 'rgba(16,185,129,0.15)';
            alertBox.style.color = '#34d399';
            alertBox.style.border = '1px solid rgba(16,185,129,0.4)';
            alertBox.innerText = 'SUCCESS! Transact customer created. ID: ' + data.transactId + ' linked to MCD customer ' + data.mcdId + ' (' + data.customer.FirstName + ' ' + data.customer.LastName + ')';
            showToast('Synced with Transact! ID: ' + data.transactId);
          }
          await loadDatabase();
          if (data.customer) inspectRecord(data.customer);
        } else {
          alertBox.style.background = 'rgba(239,68,68,0.15)';
          alertBox.style.color = '#f87171';
          alertBox.style.border = '1px solid rgba(239,68,68,0.4)';
          alertBox.innerText = 'FAILED: ' + (data.message || 'Unknown error');
        }
      } catch (err) {
        alertBox.style.background = 'rgba(239,68,68,0.15)';
        alertBox.style.color = '#f87171';
        alertBox.style.border = '1px solid rgba(239,68,68,0.4)';
        alertBox.innerText = 'ERROR: ' + err.message;
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>⚡ Call Transact & Sync</span>';
      }
    }

    function quickSync(code) {
      const input = document.getElementById('sync-personal-code');
      if (input) input.value = code;
      const select = document.getElementById('sync-customer-select');
      if (select) select.value = code;
      triggerTransactSync();
    }

    function setupTableEvents() {
      const container = document.getElementById('table-display');
      if (!container) return;
      container.addEventListener('click', function(e) {
        const btnSync = e.target.closest('.btn-sync');
        if (btnSync) {
          e.stopPropagation();
          const pCode = btnSync.getAttribute('data-code');
          if (pCode) quickSync(pCode);
          return;
        }

        const btnEdit = e.target.closest('.btn-edit');
        if (btnEdit) {
          e.stopPropagation();
          const tr = btnEdit.closest('tr');
          if (tr) openEditById(tr.getAttribute('data-col'), tr.getAttribute('data-id'));
          return;
        }

        const btnDel = e.target.closest('.btn-delete');
        if (btnDel) {
          e.stopPropagation();
          const tr = btnDel.closest('tr');
          if (tr) deleteRecord(tr.getAttribute('data-col'), tr.getAttribute('data-id'));
          return;
        }

        const tr = e.target.closest('tr[data-id]');
        if (tr) {
          selectRecord(tr.getAttribute('data-col'), tr.getAttribute('data-id'));
        }
      });
    }

    function updateThemeButton() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const icon = document.getElementById('theme-icon');
      const label = document.getElementById('theme-label');
      if (icon) icon.innerText = isLight ? '🌙' : '☀️';
      if (label) label.innerText = isLight ? 'Dark Mode' : 'Light Mode';
    }

    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme');
      if (current === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('mcd-theme', 'dark');
        showToast('Switched to Dark Theme');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('mcd-theme', 'light');
        showToast('Switched to Light Theme');
      }
      updateThemeButton();
    }

    // ---------------------------------------------------------
    // Formpipe LaserNet Client Operations
    // ---------------------------------------------------------
    var sampleFormpipePayload = JSON.stringify({
      "payloadContentType": "application/json",
      "payloadEncoding": "plain",
      "payloadType": "my-template",
      "payload": {
        "clients": [
          {
            "client": {
              "type": "person",
              "resType": "LT",
              "death": "N",
              "custCode": "100001",
              "forpostNo": "",
              "firstName": "John",
              "lastName": "Doe",
              "fullName": "John Doe",
              "persCode": "49905201314",
              "compCode": "123456789",
              "persCodeCtry": "Lithuania",
              "docIssCtry": "Lithuania",
              "docName": "Pasas",
              "docID": "123456",
              "docIssDate": "2024-10-01",
              "docExpDate": "3034-10-01",
              "natIdCtry": "",
              "natIdName": "",
              "natIdCode": "",
              "natIdNo": "",
              "birthDate": "1999-01-01",
              "addressStreet": "Versmelės g.",
              "addressBuildingNr": "10",
              "addressFlatNr": "2",
              "addressBoxNr": "",
              "addressMunicipality": "Vilniaus rajono savivaldybė",
              "addressSubdistrict": "",
              "addressCity": "Miestas",
              "addressRegion": "Apskritis",
              "addressPostCode": "LT-92343",
              "addressCountry": "Lithuania",
              "email": "john.doe@email.com",
              "phone": "+12125556342",
              "landline": "",
              "electronicBox": "",
              "relatedPersonRelationCode": "",
              "relatedPersonRelationName": "",
              "relatedPersonName": ""
            }
          }
        ],
        "accnts": [
          {
            "accnt": {
              "rowNr": "",
              "IBAN": "LT197180333377724444",
              "currency": "EUR",
              "LimitTrans": "50.00",
              "limitDay": "50.00",
              "limitMonth": "50.00",
              "debRight": "Y",
              "credRight": "Y",
              "reviewRight": "Y"
            }
          }
        ],
        "usersRights": [
          {
            "userRights": {
              "name": "John Doe",
              "id": "KL556889P",
              "pswdNo": "1111111",
              "initPwd": "",
              "genNo": "",
              "authType": "",
              "smartId": "Y",
              "sgn": "",
              "accntRowNr": "1, 2, 3"
            }
          }
        ],
        "sgnRights": {
          "primUserLst": "",
          "primCnt": "",
          "secUserLst": "",
          "secCnt": "",
          "noSignUserLst": "",
          "noSignCnt": ""
        },
        "delivery": {
          "delyveryEmail": "Y",
          "printCopy": "Y",
          "authMeansCnt": "3"
        },
        "document": {
          "no": "IB11-55368",
          "code": "K06SD01/K06SD02",
          "type": "InternetinesBankininkystesPaslaugosTeikimoSutartis",
          "date": "2024-12-12",
          "time": "10:25:00",
          "language": "LT",
          "sourceSystem": "",
          "sourceApplication": ""
        }
      }
    }, null, 2);

    function switchSystem(sys) {
      var mcdSection = document.getElementById('system-content-mcd');
      var formpipeSection = document.getElementById('system-content-formpipe');
      var btnMcd = document.getElementById('btn-system-mcd');
      var btnFormpipe = document.getElementById('btn-system-formpipe');

      if (sys === 'formpipe') {
        if (mcdSection) mcdSection.style.display = 'none';
        if (formpipeSection) formpipeSection.style.display = 'block';
        if (btnMcd) btnMcd.classList.remove('active');
        if (btnFormpipe) btnFormpipe.classList.add('active');
        localStorage.setItem('selected-system', 'formpipe');
        initFormpipeInputs();
        showToast('Switched to Formpipe LaserNet APIs');
      } else {
        if (mcdSection) mcdSection.style.display = 'block';
        if (formpipeSection) formpipeSection.style.display = 'none';
        if (btnMcd) btnMcd.classList.add('active');
        if (btnFormpipe) btnFormpipe.classList.remove('active');
        localStorage.setItem('selected-system', 'mcd');
        showToast('Switched to MCD Infinity Banking');
      }
    }

    function initFormpipeInputs() {
      var b1 = document.getElementById('formpipe-payload-api1');
      if (b1 && !b1.value) b1.value = sampleFormpipePayload;
      var b2 = document.getElementById('formpipe-payload-api2');
      if (b2 && !b2.value) b2.value = sampleFormpipePayload;
    }

    function resetFormpipePayload(boxId) {
      var el = document.getElementById(boxId);
      if (el) {
        el.value = sampleFormpipePayload;
        showToast('Sample contract payload restored');
      }
    }

    async function testFormpipeGenerate() {
      var statusEl = document.getElementById('formpipe-api1-status');
      var outEl = document.getElementById('formpipe-api1-response');
      var key = document.getElementById('formpipe-api1-key').value.trim();
      var payloadStr = document.getElementById('formpipe-payload-api1').value;

      statusEl.innerHTML = '<span style="color:var(--text-muted);">Generating document...</span>';
      outEl.innerText = '// Calling POST /formpipe-adapter/v1/document-generation/generate...';

      try {
        var t0 = performance.now();
        var res = await fetch('/formpipe-adapter/v1/document-generation/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'AccessKey': key
          },
          body: payloadStr
        });
        var t1 = performance.now();
        var data = await res.json();
        statusEl.innerHTML = '<span style="color:var(--accent-green);">HTTP ' + res.status + ' OK (' + Math.round(t1 - t0) + 'ms)</span>';
        outEl.innerText = JSON.stringify(data, null, 2);
        showToast('Document generated! DocID: ' + data.DocID);
      } catch (err) {
        statusEl.innerHTML = '<span style="color:var(--accent-red);">Error</span>';
        outEl.innerText = '// Request failed: ' + err.message;
      }
    }

    var api2PdfBlob = null;
    var api2PdfUrl = null;

    async function testFormpipeDocumentOnly() {
      var statusEl = document.getElementById('formpipe-api2-status');
      var outEl = document.getElementById('formpipe-api2-response');
      var iframe = document.getElementById('formpipe-api2-iframe');
      var btnDownload = document.getElementById('btn-download-api2');
      var btnPreview = document.getElementById('btn-toggle-preview-api2');
      var key = document.getElementById('formpipe-api2-key').value.trim();
      var payloadStr = document.getElementById('formpipe-payload-api2').value;

      statusEl.innerHTML = '<span style="color:var(--text-muted);">Streaming binary PDF...</span>';
      outEl.innerText = '// Calling POST /formpipe-adapter/v1/document-generation/documentonly...';

      try {
        var t0 = performance.now();
        var res = await fetch('/formpipe-adapter/v1/document-generation/documentonly', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'AccessKey': key
          },
          body: payloadStr
        });
        var t1 = performance.now();
        var blob = await res.blob();
        api2PdfBlob = blob;
        if (api2PdfUrl) URL.revokeObjectURL(api2PdfUrl);
        api2PdfUrl = URL.createObjectURL(blob);

        statusEl.innerHTML = '<span style="color:var(--accent-green);">HTTP ' + res.status + ' OK (' + Math.round(t1 - t0) + 'ms)</span>';
        outEl.innerText = '// Binary PDF received successfully:\n' +
          'Content-Type: ' + res.headers.get('content-type') + '\n' +
          'Byte Size: ' + blob.size.toLocaleString() + ' bytes (' + (blob.size / 1024).toFixed(2) + ' KB)\n' +
          'Format: Raw PDF Byte Array (%PDF-1.4 binary stream)\n' +
          'Document: InternetinesBankininkystesPaslaugosTeikimoSutartis (4 Pages)\n' +
          'Preview: Live embedded PDF rendered below.';

        btnDownload.style.display = 'inline-flex';
        btnPreview.style.display = 'inline-flex';
        iframe.src = api2PdfUrl;
        iframe.style.display = 'block';
        showToast('PDF byte array received (' + (blob.size / 1024).toFixed(1) + ' KB)!');
      } catch (err) {
        statusEl.innerHTML = '<span style="color:var(--accent-red);">Error</span>';
        outEl.innerText = '// Request failed: ' + err.message;
      }
    }

    function downloadApi2Pdf() {
      if (!api2PdfBlob && !api2PdfUrl) return;
      var a = document.createElement('a');
      a.href = api2PdfUrl;
      a.download = 'formpipe-document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Downloaded formpipe-document.pdf');
    }

    function toggleApi2Preview() {
      var iframe = document.getElementById('formpipe-api2-iframe');
      if (iframe) {
        iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
      }
    }

    var api3Base64 = '';
    var api3PdfUrl = null;

    async function testFormpipeGetFile() {
      var docId = document.getElementById('formpipe-api3-id').value.trim() || '68719477778';
      var key = document.getElementById('formpipe-api3-key').value.trim();
      var format = document.getElementById('formpipe-api3-format').value;
      var statusEl = document.getElementById('formpipe-api3-status');
      var outEl = document.getElementById('formpipe-api3-response');
      var iframe = document.getElementById('formpipe-api3-iframe');
      var btnDownload = document.getElementById('btn-download-api3');
      var btnPreview = document.getElementById('btn-toggle-preview-api3');

      var url = '/formpipe-adapter/v1/documents/by-id/' + encodeURIComponent(docId) + '/file';
      if (format === 'pdf') url += '?format=pdf';
      else if (format === 'json') url += '?format=json';

      statusEl.innerHTML = '<span style="color:var(--text-muted);">Fetching document...</span>';
      outEl.innerText = '// Calling GET ' + url + '...';

      try {
        var t0 = performance.now();
        var res = await fetch(url, {
          method: 'GET',
          headers: {
            'AccessKey': key
          }
        });
        var t1 = performance.now();

        if (format === 'pdf') {
          var blob = await res.blob();
          if (api3PdfUrl) URL.revokeObjectURL(api3PdfUrl);
          api3PdfUrl = URL.createObjectURL(blob);
          statusEl.innerHTML = '<span style="color:var(--accent-green);">HTTP ' + res.status + ' OK (' + Math.round(t1 - t0) + 'ms)</span>';
          outEl.innerText = '// Binary PDF received directly:\n' +
            'Size: ' + blob.size.toLocaleString() + ' bytes (' + (blob.size / 1024).toFixed(2) + ' KB)\n' +
            'Content-Type: ' + res.headers.get('content-type');
          iframe.src = api3PdfUrl;
          iframe.style.display = 'block';
          btnDownload.style.display = 'inline-flex';
          btnPreview.style.display = 'inline-flex';
          showToast('PDF fetched for DocID: ' + docId);
          return;
        }

        if (format === 'json') {
          var data = await res.json();
          api3Base64 = data.file || '';
          statusEl.innerHTML = '<span style="color:var(--accent-green);">HTTP ' + res.status + ' OK (' + Math.round(t1 - t0) + 'ms)</span>';
          outEl.innerText = JSON.stringify({
            status: data.status,
            DocID: data.DocID,
            message: data.message,
            file: (data.file ? (data.file.substring(0, 100) + '... (' + data.file.length.toLocaleString() + ' base64 characters total)') : '')
          }, null, 2);
        } else {
          var text = await res.text();
          api3Base64 = text;
          statusEl.innerHTML = '<span style="color:var(--accent-green);">HTTP ' + res.status + ' OK (' + Math.round(t1 - t0) + 'ms)</span>';
          outEl.innerText = '// Base64 string response (' + text.length.toLocaleString() + ' characters):\n' +
            text.substring(0, 300) + '\n... [truncated for display, full length: ' + text.length.toLocaleString() + ' chars]';
        }

        if (api3Base64) {
          btnDownload.style.display = 'inline-flex';
          btnPreview.style.display = 'inline-flex';
          iframe.src = 'data:application/pdf;base64,' + api3Base64;
          iframe.style.display = 'block';
          showToast('Base64 document retrieved (' + api3Base64.length.toLocaleString() + ' chars)');
        }
      } catch (err) {
        statusEl.innerHTML = '<span style="color:var(--accent-red);">Error</span>';
        outEl.innerText = '// Request failed: ' + err.message;
      }
    }

    function downloadApi3Pdf() {
      if (api3PdfUrl) {
        var a = document.createElement('a');
        a.href = api3PdfUrl;
        a.download = 'formpipe-doc-' + (document.getElementById('formpipe-api3-id').value.trim() || 'file') + '.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Downloaded PDF file');
        return;
      }
      if (!api3Base64) return;
      var byteCharacters = atob(api3Base64);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var blob = new Blob([byteArray], { type: 'application/pdf' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'formpipe-doc-' + (document.getElementById('formpipe-api3-id').value.trim() || 'file') + '.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
      showToast('Downloaded decoded PDF file');
    }

    function toggleApi3Preview() {
      var iframe = document.getElementById('formpipe-api3-iframe');
      if (iframe) {
        iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
      }
    }

    function copyFormpipeCurl(type) {
      var host = window.location.origin;
      var cmd = '';
      if (type === 'generate') {
        var key = document.getElementById('formpipe-api1-key').value;
        var body = document.getElementById('formpipe-payload-api1').value;
        cmd = "curl --location '" + host + "/formpipe-adapter/v1/document-generation/generate' \\\n--header 'Content-Type: application/json' \\\n--header 'AccessKey: " + key + "' \\\n--data-raw '" + body.replace(/'/g, "'\\''") + "'";
      } else if (type === 'documentonly') {
        var key = document.getElementById('formpipe-api2-key').value;
        var body = document.getElementById('formpipe-payload-api2').value;
        cmd = "curl --location '" + host + "/formpipe-adapter/v1/document-generation/documentonly' \\\n--header 'Content-Type: application/json' \\\n--header 'AccessKey: " + key + "' \\\n--data-raw '" + body.replace(/'/g, "'\\''") + "' --output document.pdf";
      } else if (type === 'getfile') {
        var id = document.getElementById('formpipe-api3-id').value.trim() || '68719477778';
        var key = document.getElementById('formpipe-api3-key').value;
        cmd = "curl --location '" + host + "/formpipe-adapter/v1/documents/by-id/" + id + "/file' \\\n--header 'AccessKey: " + key + "'";
      }
      copyToClipboard(cmd);
    }

    function copyToClipboard(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() { showToast('cURL command copied to clipboard!'); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('cURL command copied to clipboard!');
      }
    }

    // Initialize
    updateThemeButton();
    setupTableEvents();
    loadDatabase();

    var savedSys = localStorage.getItem('selected-system');
    if (savedSys === 'formpipe' || window.location.search.includes('system=formpipe')) {
      switchSystem('formpipe');
    } else {
      initFormpipeInputs();
    }
  </script>
</body>
</html>`;
}

// Create HTTP server
export const server = http.createServer(handleRequest);
export default handleRequest;


// Auto-start when executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log('====================================================');
    console.log(` MCD Infinity API Server is running on port ${PORT}`);
    console.log(` Web Dashboard:  http://localhost:${PORT}/`);
    console.log(` Database JSON:  http://localhost:${PORT}/admin/db`);
    console.log(` Swagger Docs:   http://localhost:${PORT}/docs`);
    console.log(` OpenAPI Spec:   http://localhost:${PORT}/openapi.json`);
    console.log(` Health Check:   http://localhost:${PORT}/health`);
    console.log(` DB File Path:   ${DB_FILE_PATH}`);
    console.log('====================================================');
  });
}
