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

-- States
CREATE TABLE IF NOT EXISTS states (
    id TEXT PRIMARY KEY,   -- use API-provided ID as PK
    name TEXT NOT NULL
);

-- Districts
CREATE TABLE IF NOT EXISTS districts (
    id TEXT PRIMARY KEY, -- use API ID as PK
    name TEXT NOT NULL,
    stateId TEXT NOT NULL,
    FOREIGN KEY (stateId) REFERENCES states(id)
);

-- Complexes
CREATE TABLE IF NOT EXISTS complexes (
    id TEXT PRIMARY KEY,  -- use API ID as PK
    name TEXT NOT NULL,
    districtId TEXT NOT NULL,
    FOREIGN KEY (districtId) REFERENCES districts(id)
);

-- Courts
CREATE TABLE IF NOT EXISTS courts (
    court_id TEXT PRIMARY KEY,    -- use API ID as PK
    name TEXT NOT NULL,
    stateId TEXT NOT NULL,
    districtId TEXT NOT NULL,
    complexId TEXT NOT NULL,
    FOREIGN KEY (stateId) REFERENCES states(id),
    FOREIGN KEY (districtId) REFERENCES districts(id),
    FOREIGN KEY (complexId) REFERENCES complexes(id)
);