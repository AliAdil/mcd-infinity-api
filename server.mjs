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

// Initial seed data
const initialSeedData = {
  physicalPersons: [
    ['P1001', {
      McdId: 'P1001',
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
    ['P1002', {
      McdId: 'P1002',
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
    ['P1003', {
      McdId: 'P1003',
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
      guardianMcdId: 'P1001',
      coapplicantMcdId: null
    }]
  ],

  juridicalPersons: [
    ['J2001', {
      McdId: 'J2001',
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

// Sequence counters
export let physicalSeq = 1004;
export let juridicalSeq = 2002;
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

// Helper: send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept'
  });
  res.end(JSON.stringify(data, null, 2));
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

export function buildTransactPayload(customer, overrides = {}) {
  const givenName = toSwiftSafeString(customer.FirstName) || 'Customer';
  const lastName = toSwiftSafeString(customer.LastName) || 'User';
  const fullName = `${givenName} ${lastName}`.trim();

  // Generate unique mnemonic with XD series prefix (e.g. XD005, XD10123)
  const mnemonic = overrides.customerMnemonic || generateCustomerMnemonic('XD');

  const dob = customer.DateOfBirth || '1990-01-01';

  const fullPhone = customer.PrimaryPhoneNumber || '+37060012345';
  let idd = '+370';
  let phone = '60012345';
  if (fullPhone.startsWith('+')) {
    idd = fullPhone.slice(0, 4);
    phone = fullPhone.slice(4).replace(/\D/g, '') || '60012345';
  } else {
    phone = fullPhone.replace(/\D/g, '') || '60012345';
  }
  const email = toSwiftSafeString(customer.PrimaryEmail, '@_') || `${givenName.toLowerCase()}@example.com`;

  const addr = customer.RegistrationAddress || {};
  const street = toSwiftSafeString(addr.fullAddress || addr.street) || 'Gedimino pr. 12-4';
  const city = toSwiftSafeString(addr.city) || 'Vilnius';
  const postCode = parseInt(String(addr.postCode || '75350').replace(/\D/g, ''), 10) || 75350;
  const country = 'PK';

  return {
    body: {
      displayNames: [{ displayName: fullName }],
      customerNames: [{ customerName: givenName, customerNameAdditional: lastName }],
      faxIds: [{ faxId: 'FAX001' }],
      officePhoneNumbers: [{ officePhoneNumber: fullPhone }],
      streets: [{ street }],
      addressCities: [{ addressCity: city }],
      countries: [{ country }],
      otherNationalityIds: [{ otherNationalityId: country }],
      postingRestrictIds: [{ postingRestrictId: 1 }],
      taxIds: [{ taxId: `TAX${Math.floor(1000000 + Math.random() * 9000000)}` }],
      contactDetails: [
        { contactType: 'MOBILE', iddPrefixPhone: idd, contactData: phone },
        { contactType: 'EMAIL', iddPrefixPhone: '', contactData: email }
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
      gender: customer.Gender === 'FEMALE' ? 'FEMALE' : 'MALE',
      maritalStatus: 'MARRIED',
      industryId: '13',
      postCode,
      introducer: 'DIGITALONBOARDING',
      kycNextSystemReviewDate: '2027-01-15',
      kycNextReviewDate: '2027-01-15',
      amlLastResultDate: '2026-09-08',
      title: customer.Gender === 'FEMALE' ? 'MS' : 'MR',
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
        customerSegment: 'RETAIL'
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
      const prefix = colName.startsWith('p') ? 'P' : colName.startsWith('j') ? 'J' : colName.startsWith('r') ? 'R' : 'A';
      const id = body.McdId || (prefix + Math.floor(1000 + Math.random() * 9000));
      const record = { ...body, McdId: id };

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
      for (const p of db.physicalPersons.values()) {
        let match = true;
        if (query.FirstName && !p.FirstName.toLowerCase().includes(query.FirstName.toLowerCase())) match = false;
        if (query.LastName && !p.LastName.toLowerCase().includes(query.LastName.toLowerCase())) match = false;
        if (query.PersonalCode && p.PersonalCode !== query.PersonalCode) match = false;
        if (query.CountryCode && p.CountryCode !== query.CountryCode) match = false;
        if (query.IsJunior !== undefined) {
          const isJuniorBool = query.IsJunior === 'true';
          if (Boolean(p.IsMinor) !== isJuniorBool) match = false;
        }
        if (match) {
          results.push({
            McdId: p.McdId,
            FirstName: p.FirstName,
            MiddleName: p.MiddleName,
            LastName: p.LastName,
            PersonalCode: p.PersonalCode,
            CountryCode: p.CountryCode,
            Status: p.Status,
            TransactID: p.TransactID,
            SelectedProducts: p.SelectedProducts
          });
        }
      }
      return sendJson(res, 200, results);
    }

    // POST /persons/physical - Create physical prospect
    if (method === 'POST' && pathname === '/persons/physical') {
      const body = await parseBody(req);
      if (!body.firstName || !body.lastName || !body.personalCode) {
        return sendJson(res, 400, {
          ErrorCode: '400001',
          ErrorMessage: 'Missing mandatory fields: firstName, lastName, personalCode'
        });
      }

      // Check if this personalCode already belongs to an existing MCD customer with a TransactID, or if TransactID was provided in body
      let existingCustomer = null;
      for (const [key, p] of db.physicalPersons.entries()) {
        if (String(p.PersonalCode).trim() === String(body.personalCode).trim()) {
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

      const newMcdId = 'P' + (physicalSeq++);
      const isMinor = body.dateOfBirth && (new Date().getFullYear() - new Date(body.dateOfBirth).getFullYear() < 18);
      const newPerson = {
        McdId: newMcdId,
        FirstName: body.firstName,
        MiddleName: body.middleName || null,
        LastName: body.lastName,
        PersonalCode: body.personalCode,
        CountryCode: body.countryCode || 'LT',
        Gender: body.gender || 'MALE',
        Status: 'Prospect',
        TransactID: hasId ? String(preExistingId) : null,
        TransactId: hasId ? String(preExistingId) : null,
        TransactStatus: hasId ? 'Synced' : 'Pending',
        DateOfBirth: body.dateOfBirth || '1995-01-01',
        DateOfDeath: null,
        BirthCountryCode: body.countryCode || 'LT',
        BirthCity: 'Vilnius',
        LanguageCode: 'lt',
        PrimaryEmail: body.email || null,
        PrimaryEmailVerified: Boolean(body.emailVerified),
        SecondaryEmail: null,
        PrimaryPhoneNumber: body.phoneNumber || null,
        PrimaryPhoneNumberVerified: Boolean(body.phoneNumberVerified),
        SecondaryPhoneNumber: null,
        RegistrationAddress: body.ResidenceAddress || { countryCode: body.countryCode || 'LT', city: 'Vilnius', street: 'Gedimino pr. 1' },
        ResidenceAddress: body.ResidenceAddress || null,
        CorrespondenceAddress: body.CorrespondenceAddress || body.ResidenceAddress || { countryCode: body.countryCode || 'LT', city: 'Vilnius' },
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
      const person = db.physicalPersons.get(mcdId);
      if (!person) {
        return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Physical person ${mcdId} not found` });
      }
      const potentialGuardians = [
        { mcdId: 'P1001', firstName: 'Jonas', lastName: 'Kazlauskas', personalCode: '38501010001' },
        { mcdId: 'P1002', firstName: 'Ieva', lastName: 'Kazlauskienė', personalCode: '48802020002' }
      ].filter(g => g.mcdId !== mcdId);

      return sendJson(res, 200, potentialGuardians);
    }

    // PUT /persons/physical/:mcdId/guardian/:guardianMcdId
    m = pathname.match(/^\/persons\/physical\/([^\/]+)\/guardian\/([^\/]+)$/);
    if (method === 'PUT' && m) {
      const [, mcdId, guardianMcdId] = m;
      const person = db.physicalPersons.get(mcdId);
      const guardian = db.physicalPersons.get(guardianMcdId);
      if (!person) return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Child person ${mcdId} not found` });
      if (!guardian) return sendJson(res, 404, { ErrorCode: '404002', ErrorMessage: `Guardian person ${guardianMcdId} not found` });

      person.guardianMcdId = guardianMcdId;
      syncDbToFile();
      return sendJson(res, 200, { success: true, message: `Guardian ${guardianMcdId} set for junior ${mcdId}` });
    }

    // GET /persons/physical/:mcdId/children
    m = pathname.match(/^\/persons\/physical\/([^\/]+)\/children$/);
    if (method === 'GET' && m) {
      const mcdId = m[1];
      const person = db.physicalPersons.get(mcdId);
      if (!person) return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Person ${mcdId} not found` });

      const children = [];
      for (const p of db.physicalPersons.values()) {
        if (p.guardianMcdId === mcdId || (p.IsMinor && p.LastName === person.LastName)) {
          children.push({
            FirstName: p.FirstName,
            LastName: p.LastName,
            PersonalCode: p.PersonalCode,
            DateOfBirth: p.DateOfBirth,
            McdId: p.McdId,
            PhoneNumber: p.PrimaryPhoneNumber,
            PhoneNumberVerified: p.PrimaryPhoneNumberVerified,
            Email: p.PrimaryEmail,
            EmailVerified: p.PrimaryEmailVerified,
            CountryCode: p.CountryCode,
            isWard: p.guardianMcdId === mcdId
          });
        }
      }
      return sendJson(res, 200, children);
    }

    // PUT /persons/physical/:mcdId/coapplicant/:coapplicantMcdId
    m = pathname.match(/^\/persons\/physical\/([^\/]+)\/coapplicant\/([^\/]+)$/);
    if (method === 'PUT' && m) {
      const [, mcdId, coapplicantMcdId] = m;
      const person = db.physicalPersons.get(mcdId);
      const coapplicant = db.physicalPersons.get(coapplicantMcdId);
      if (!person || !coapplicant) {
        return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: 'Person or coapplicant not found' });
      }
      person.coapplicantMcdId = coapplicantMcdId;
      coapplicant.coapplicantMcdId = mcdId;
      syncDbToFile();
      return sendJson(res, 200, { success: true, message: `Coapplicants ${mcdId} and ${coapplicantMcdId} linked` });
    }

    // POST /persons/physical/:mcdId/consent
    m = pathname.match(/^\/persons\/physical\/([^\/]+)\/consent$/);
    if (method === 'POST' && m) {
      const mcdId = m[1];
      const person = db.physicalPersons.get(mcdId);
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
      const person = db.physicalPersons.get(mcdId);
      if (!person) return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Physical person ${mcdId} not found` });
      return sendJson(res, 200, person);
    }

    // PUT /persons/physical/:mcdId - Update physical person
    m = pathname.match(/^\/persons\/physical\/([^\/]+)$/);
    if (method === 'PUT' && m) {
      const mcdId = m[1];
      const person = db.physicalPersons.get(mcdId);
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
            McdId: acc.McdId,
            FullName: acc.FullName,
            CompanyCode: acc.CompanyCode,
            CountryCode: acc.CountryCode,
            Status: acc.Status,
            TransactId: acc.TransactId
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

      const newJurId = 'J' + (juridicalSeq++);
      const newJur = {
        McdId: newJurId,
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
      const jur = db.juridicalPersons.get(mcdId);
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
      const jur = db.juridicalPersons.get(mcdId);
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
      for (const j of db.juridicalPersons.values()) {
        let match = true;
        if (query.CompanyCode && j.CompanyCode !== query.CompanyCode) match = false;
        if (query.CountryCode && j.CountryCode !== query.CountryCode) match = false;
        if (match) {
          results.push({
            McdId: j.McdId,
            FullName: j.FullName,
            CompanyCode: j.CompanyCode,
            CountryCode: j.CountryCode,
            Status: j.Status,
            TransactId: j.TransactId
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
        const jId = 'J' + (juridicalSeq++);
        juridical = {
          McdId: jId,
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
      const jur = db.juridicalPersons.get(mcdId);
      if (!jur) return sendJson(res, 404, { ErrorCode: '404001', ErrorMessage: `Juridical person ${mcdId} not found` });
      return sendJson(res, 200, jur);
    }

    // PUT /persons/juridical/:mcdId - Update juridical person
    m = pathname.match(/^\/persons\/juridical\/([^\/]+)$/);
    if (method === 'PUT' && m) {
      const mcdId = m[1];
      const jur = db.juridicalPersons.get(mcdId);
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
      for (const r of db.representatives.values()) {
        let match = true;
        if (query.FirstName && !r.FirstName.toLowerCase().includes(query.FirstName.toLowerCase())) match = false;
        if (query.LastName && !r.LastName.toLowerCase().includes(query.LastName.toLowerCase())) match = false;
        if (query.PersonalCode && r.PersonalCode !== query.PersonalCode) match = false;
        if (query.CountryCode && r.CountryCode !== query.CountryCode) match = false;
        if (match) {
          results.push({
            McdId: r.McdId,
            FirstName: r.FirstName,
            LastName: r.LastName,
            PersonalCode: r.PersonalCode,
            CountryCode: r.CountryCode,
            Status: r.Status || 'Existing'
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
  <style>
    :root {
      --primary: #9373ee;
      --primary-dark: #6e4bc5;
      --bg: #0f172a;
      --card-bg: #1e293b;
      --border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent-green: #10b981;
      --accent-blue: #38bdf8;
      --accent-orange: #f59e0b;
      --accent-purple: #c084fc;
      --accent-red: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 24px;
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
    .title h1 { font-size: 24px; font-weight: 700; color: #fff; }
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
    .nav-links { display: flex; gap: 10px; flex-wrap: wrap; }
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
      transition: background 0.2s;
    }
    .btn:hover { background: var(--primary-dark); }
    .btn-secondary { background: #334155; }
    .btn-secondary:hover { background: #475569; }
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
      transition: transform 0.15s, border-color 0.15s;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      border-color: var(--primary);
    }
    .stat-label { font-size: 12px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; }
    .stat-value { font-size: 28px; font-weight: 700; margin-top: 4px; color: #fff; }
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
    }
    .card-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
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
      background: #0f172a;
      border: 1px solid var(--border);
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .endpoint-item:hover { border-color: var(--primary); }
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
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 16px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      color: #38bdf8;
      max-height: 480px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* Database Table Styling */
    .table-container {
      overflow-x: auto;
      background: #0f172a;
      border-radius: 8px;
      border: 1px solid var(--border);
      margin-top: 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }
    th, td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border);
    }
    th {
      background: #1e293b;
      color: var(--text-muted);
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
    }
    tr:hover { background: rgba(147, 115, 238, 0.05); }
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
      background: #1e293b;
      border: 1px solid #3b82f6;
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
    .modal-header h3 { font-size: 18px; color: #fff; }
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
      background: #0f172a;
      border-bottom-left-radius: 14px;
      border-bottom-right-radius: 14px;
    }
    .json-editor {
      width: 100%;
      height: 380px;
      background: #090d16;
      color: #38bdf8;
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
        <a href="/admin/db" target="_blank" class="btn btn-secondary">DB JSON</a>
        <a href="/docs" target="_blank" class="btn">Swagger UI</a>
        <a href="/openapi.json" target="_blank" class="btn btn-secondary">OpenAPI Spec</a>
      </div>
    </div>
  </div>

  <div class="stats-grid">
    <div class="stat-card" onclick="switchTable('physical')">
      <div class="stat-label">Physical Persons</div>
      <div class="stat-value" id="count-physical">${db.physicalPersons.size}</div>
      <div class="stat-hint">Retail, Juniors, Guardians (e.g. P1001, P1002, P1003)</div>
    </div>
    <div class="stat-card" onclick="switchTable('juridical')">
      <div class="stat-label">Juridical (SME)</div>
      <div class="stat-value" id="count-juridical">${db.juridicalPersons.size}</div>
      <div class="stat-hint">Corporate clients & JAR validation (e.g. J2001)</div>
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
    <div class="card" style="margin-bottom: 20px; background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95)); border: 1px solid rgba(56, 189, 248, 0.35);">
      <div class="card-title" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:18px;">⚡</span>
          <span style="font-size:16px; font-weight:700; color:#38bdf8;">Transact Core Banking Sync</span>
          <span style="font-size:11px; color:var(--text-muted);">(Temenos T24 Customers API)</span>
        </div>
        <span style="font-size:11px; background:rgba(56,189,248,0.15); color:#38bdf8; padding:3px 8px; border-radius:12px; font-family:monospace;">Target: 192.168.1.157:8085</span>
      </div>
      <div style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
        Enter a <strong>Personal Code</strong> below. The system will look up the customer in MCD, call the Transact Customer API (T24), extract the assigned <code>id</code>, and automatically update the customer's <strong>TransactID</strong> in the database!
      </div>
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <select id="sync-customer-select" onchange="if(this.value){document.getElementById('sync-personal-code').value=this.value;}" style="padding:10px 14px; background:#0b1120; border:1px solid var(--border); border-radius:6px; color:#f8fafc; font-size:13px; max-width:320px;">
          <option value="">-- Select customer to sync --</option>
        </select>
        <input type="text" id="sync-personal-code" placeholder="Personal Code (e.g. 38501010001, 39001010099)" style="flex:1; min-width:220px; padding:10px 14px; background:#0b1120; border:1px solid var(--border); border-radius:6px; color:#f8fafc; font-family:monospace;" value="39001010099" />
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
          <select id="table-selector" onchange="switchTable(this.value)" style="background: #0f172a; color: #fff; border: 1px solid var(--border); padding: 5px 10px; border-radius: 6px; font-weight: 600;">
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
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/physical/P1001')">
            <div><span class="method-tag method-get">GET</span>/persons/physical/P1001</div>
            <span style="color: var(--text-muted); font-size: 11px;">Get Jonas Kazlauskas</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/physical/P1003/potentialGuardians')">
            <div><span class="method-tag method-get">GET</span>/persons/physical/P1003/potentialGuardians</div>
            <span style="color: var(--text-muted); font-size: 11px;">Get junior guardians</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/physical/P1001/children')">
            <div><span class="method-tag method-get">GET</span>/persons/physical/P1001/children</div>
            <span style="color: var(--text-muted); font-size: 11px;">Get client's children</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('POST', '/persons/physical', sampleProspect)">
            <div><span class="method-tag method-post">POST</span>/persons/physical</div>
            <span style="color: var(--text-muted); font-size: 11px;">Create physical prospect</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('POST', '/persons/physical/P1001/consent', { ConsentOffers: true, ConsentProfiling: true, ConsentPartnersOffers: true })">
            <div><span class="method-tag method-post">POST</span>/persons/physical/P1001/consent</div>
            <span style="color: var(--text-muted); font-size: 11px;">Update consents</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/juridical')">
            <div><span class="method-tag method-get">GET</span>/persons/juridical</div>
            <span style="color: var(--text-muted); font-size: 11px;">Search SME clients</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/juridical/J2001')">
            <div><span class="method-tag method-get">GET</span>/persons/juridical/J2001</div>
            <span style="color: var(--text-muted); font-size: 11px;">Get juridical person</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/juridical/accumulated')">
            <div><span class="method-tag method-get">GET</span>/persons/juridical/accumulated</div>
            <span style="color: var(--text-muted); font-size: 11px;">Search accumulated acc.</span>
          </div>
          <div class="endpoint-item" onclick="testEndpoint('GET', '/persons/juridical/J2001/representatives/R3001')">
            <div><span class="method-tag method-get">GET</span>/persons/juridical/J2001/representatives/R3001</div>
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
  </div>

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
        const tId = p.TransactID || p.TransactId ? (' [Transact: ' + (p.TransactID || p.TransactId) + ']') : ' [Not Synced]';
        const code = p.PersonalCode || '';
        const name = (p.FirstName || '') + ' ' + (p.LastName || '');
        optionsHtml += '<option value="' + code + '" ' + (code === currentVal ? 'selected' : '') + '>' + p.McdId + ': ' + name + ' (' + (code || 'No Code') + ')' + tId + '</option>';
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
        if (list[i].McdId === id) return list[i];
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
          var badgeClass = p.Status === 'Existing' ? 'badge-existing' : 'badge-prospect';
          var minorTag = p.IsMinor ? '<span style="color:var(--accent-orange)">Yes (Minor)</span>' : 'No';
          html += '<tr data-col="physical" data-id="' + p.McdId + '" style="cursor:pointer;">' +
            '<td><strong style="color:var(--accent-blue)">' + p.McdId + '</strong></td>' +
            '<td>' + (p.FirstName || '') + ' ' + (p.LastName || '') + '</td>' +
            '<td>' + (p.PersonalCode || '-') + '</td>' +
            '<td>' + (p.TransactID || p.TransactId ? ('<span style="background:rgba(56,189,248,0.15); color:#38bdf8; padding:3px 8px; border-radius:4px; font-weight:600; font-family:monospace;">' + (p.TransactID || p.TransactId) + '</span>') : '<span style="color:var(--text-muted); font-size:12px;">None</span>') + '</td>' +
            '<td><span class="badge ' + badgeClass + '">' + p.Status + '</span></td>' +
            '<td>' + (p.PrimaryEmail || '-') + '</td>' +
            '<td>' + (p.PrimaryPhoneNumber || '-') + '</td>' +
            '<td>' + minorTag + (p.guardianMcdId ? ' (Guardian: ' + p.guardianMcdId + ')' : '') + '</td>' +
            '<td><div style="display:flex; gap:6px; align-items:center;">' +
              (p.PersonalCode ? '<button class="btn btn-sm btn-sync" data-code="' + p.PersonalCode + '" style="background:#0284c7; color:#fff;" title="Sync customer to Transact">⚡ Sync</button>' : '') +
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
          var badgeClass = jItem.Status === 'Existing' ? 'badge-existing' : 'badge-prospect';
          html += '<tr data-col="juridical" data-id="' + jItem.McdId + '" style="cursor:pointer;">' +
            '<td><strong style="color:var(--accent-blue)">' + jItem.McdId + '</strong></td>' +
            '<td>' + (jItem.FullName || '-') + '</td>' +
            '<td>' + (jItem.CompanyCode || '-') + '</td>' +
            '<td><span class="badge ' + badgeClass + '">' + jItem.Status + '</span></td>' +
            '<td>' + (jItem.PrimaryEmail || '-') + '</td>' +
            '<td>' + (jItem.PrimaryPhoneNumber || '-') + '</td>' +
            '<td>' + (jItem.RepresentativeMcdId || '-') + '</td>' +
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
          html += '<tr data-col="representatives" data-id="' + rItem.McdId + '" style="cursor:pointer;">' +
            '<td><strong style="color:var(--accent-blue)">' + rItem.McdId + '</strong></td>' +
            '<td>' + (rItem.FirstName || '') + ' ' + (rItem.LastName || '') + '</td>' +
            '<td>' + (rItem.PersonalCode || '-') + '</td>' +
            '<td>' + (rItem.CountryCode || '-') + '</td>' +
            '<td>' + (rItem.PrimaryEmail || '-') + '</td>' +
            '<td>' + (rItem.PrimaryPhoneNumber || '-') + '</td>' +
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
          html += '<tr data-col="accumulated" data-id="' + aItem.McdId + '" style="cursor:pointer;">' +
            '<td><strong style="color:var(--accent-blue)">' + aItem.McdId + '</strong></td>' +
            '<td>' + (aItem.FullName || '-') + '</td>' +
            '<td>' + (aItem.CompanyCode || '-') + '</td>' +
            '<td>' + (aItem.RepresentativeMcdId || '-') + '</td>' +
            '<td>' + (aItem.phoneNumber || '-') + '</td>' +
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
      const title = record.FullName || (record.FirstName + ' ' + record.LastName);
      document.getElementById('record-inspector-title').innerText = 'Record: ' + record.McdId + ' (' + title + ')';
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

      return {
        FirstName: firstName,
        LastName: lastName,
        PersonalCode: personalCode,
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
          if (modalMode === 'edit' && currentlyInspected && currentlyInspected.McdId === modalRecordId) {
            inspectRecord(result.record || payload);
          }
        } else {
          errBox.innerText = result.ErrorMessage || 'Failed to save';
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
          if (currentlyInspected && currentlyInspected.McdId === id) {
            currentlyInspected = null;
            document.getElementById('record-inspector-title').innerText = 'Record Details Inspector';
            document.getElementById('record-inspector').innerText = '// Record deleted.';
            document.getElementById('inspector-actions').style.display = 'none';
          }
          await loadDatabase();
        } else {
          alert('Delete failed: ' + (result.ErrorMessage || 'Unknown error'));
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

    // Initialize
    setupTableEvents();
    loadDatabase();
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
