import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'courtsync.db');
export const db = new Database(dbPath);

// Create table if it doesn't exist
const casesTable = `
CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_number TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT,
    cnr TEXT UNIQUE,
    advocate_name TEXT,
    filing_number TEXT,
    filing_year TEXT,
    details TEXT,
    status_details TEXT,
    parties TEXT,
    acts_and_sections TEXT,
    history TEXT,
    orders TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// states Table
const statesTable = `CREATE TABLE IF NOT EXISTS states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    state_id TEXT NOT NULL
);
`;
// districts Table
const districtsTable = `CREATE TABLE IF NOT EXISTS districts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    state_id TEXT NOT NULL,
    district_id TEXT NOT NULL
);
`;
// complexes Table
const complexesTable = `CREATE TABLE IF NOT EXISTS complexes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    district_id TEXT NOT NULL,
    complex_id TEXT NOT NULL
);
`;
// courts Table
const courtsTable = `CREATE TABLE IF NOT EXISTS courts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    state_id TEXT NOT NULL,
    district_id TEXT NOT NULL,
    complex_id TEXT NOT NULL,
    court_id TEXT NOT NULL
);
`;

db.exec(casesTable);
db.exec(statesTable);
db.exec(districtsTable);
db.exec(complexesTable);
db.exec(courtsTable);