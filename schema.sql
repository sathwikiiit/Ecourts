0,0 @@
-- Cloudflare D1 Schema for CourtSync

-- Drop tables if they exist to ensure a clean slate on recreation.
-- In production, you would use migrations instead of dropping tables.
DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS districts;
DROP TABLE IF EXISTS complexes;
DROP TABLE IF EXISTS courts;

-- Create cases table
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

-- Create states Table
CREATE TABLE IF NOT EXISTS states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    state_id TEXT NOT NULL
);

-- Create districts Table
CREATE TABLE IF NOT EXISTS districts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    state_id TEXT NOT NULL,
    district_id TEXT NOT NULL
);

-- Create complexes Table
CREATE TABLE IF NOT EXISTS complexes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    district_id TEXT NOT NULL,
    complex_id TEXT NOT NULL
);

-- Create courts Table
CREATE TABLE IF NOT EXISTS courts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    state_id TEXT NOT NULL,
    district_id TEXT NOT NULL,
    complex_id TEXT NOT NULL,
    court_id TEXT NOT NULL
);