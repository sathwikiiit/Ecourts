import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'courtsync.db');
export const db = new Database(dbPath);

// Create table if it doesn't exist
const createTable = `
CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_number TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK(status IN ('Open', 'Closed', 'Pending')),
    cnr TEXT,
    advocate_name TEXT,
    filing_number TEXT,
    filing_year TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.exec(createTable);
console.log("Database initialized and 'cases' table is ready.");
