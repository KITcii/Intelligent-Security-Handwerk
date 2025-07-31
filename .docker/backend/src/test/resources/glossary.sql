-- Create the glossary_categories table
CREATE TABLE IF NOT EXISTS glossary_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name_ VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);

-- Create the glossary table (terms)
CREATE TABLE IF NOT EXISTS glossary (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    definition VARCHAR(255),
    description TEXT NOT NULL,
    category_id BIGINT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_glossary_category
        FOREIGN KEY (category_id)
        REFERENCES glossary_categories(id)
        ON DELETE CASCADE
);

-- Create the glossary_synonyms table (to store multiple synonyms per term)
CREATE TABLE IF NOT EXISTS glossary_synonyms (
    term_id BIGINT NOT NULL,
    synonym VARCHAR(255) NOT NULL,
    PRIMARY KEY (glossary_id, synonym),
    FOREIGN KEY (term_id) REFERENCES glossary(id) ON DELETE CASCADE
);

DELETE FROM glossary_sources;
DELETE FROM glossary_synonyms;
DELETE FROM glossary;
DELETE FROM glossary_categories;

INSERT INTO glossary_categories (id, name_, description)
VALUES
    (1, 'IT Security', 'The practice of protecting systems, networks, and data from digital threats.'),
    (2, 'IT', 'The field of managing and processing information using technology.'),
    (3, 'Data', 'Information that is collected, stored, and analyzed to derive insights.');

-- Insert glossary terms
INSERT INTO glossary (id, keyword, definition, description, category_id, created_at, updated_at)
VALUES
    (1, 'Firewall', 'Monitors and controls network traffic', 'A network security system that monitors and controls incoming and outgoing network traffic.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'Antivirus', 'Detects and removes malware', 'Software designed to detect and destroy malicious software (malware).', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'Encryption', 'Encodes information to protect data', 'The process of encoding information to protect it from unauthorized access.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 'Cloud Computing', 'Internet-based computing services', 'The delivery of computing services over the Internet, such as storage, processing, and networking.', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 'Authentication', 'Verifies user or system identity', 'The process of verifying the identity of a user or system.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6, 'VPN', 'Secure private network connection', 'Virtual Private Network; provides a secure encrypted connection over a less secure network.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (7, 'XML', 'Extensible Markup Language', 'A markup language for encoding documents in a format that is both human-readable and machine-readable.', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (8, 'Autorisierung', 'Gewährt Benutzerrechte', 'Der Prozess, bei dem Benutzer Berechtigungen erhalten, um bestimmte Ressourcen oder Aktionen auszuführen.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Now insert into glossary_synonyms using the dynamically retrieved IDs
INSERT INTO glossary_synonyms (term_id, synonym)
VALUES
    ((SELECT id FROM glossary WHERE keyword = 'Firewall'), 'Security Wall'),
    ((SELECT id FROM glossary WHERE keyword = 'Firewall'), 'Packet Filter'),

    ((SELECT id FROM glossary WHERE keyword = 'Antivirus'), 'Virus Protection'),
    ((SELECT id FROM glossary WHERE keyword = 'Antivirus'), 'Malware Removal'),

    ((SELECT id FROM glossary WHERE keyword = 'Encryption'), 'Data Encryption'),
    ((SELECT id FROM glossary WHERE keyword = 'Encryption'), 'Cryptography'),
    ((SELECT id FROM glossary WHERE keyword = 'Encryption'), 'Secure Encoding'),

    ((SELECT id FROM glossary WHERE keyword = 'Cloud Computing'), 'Internet Computing'),
    ((SELECT id FROM glossary WHERE keyword = 'Cloud Computing'), 'Web-based Services'),

    ((SELECT id FROM glossary WHERE keyword = 'Authentication'), 'Identity Verification'),
    ((SELECT id FROM glossary WHERE keyword = 'Authentication'), 'User Authentication'),
    ((SELECT id FROM glossary WHERE keyword = 'Authentication'), 'Credential Check'),

    ((SELECT id FROM glossary WHERE keyword = 'VPN'), 'Virtual Private Network'),
    ((SELECT id FROM glossary WHERE keyword = 'VPN'), 'Secure Tunnel'),
    ((SELECT id FROM glossary WHERE keyword = 'VPN'), 'Encrypted Network'),

    ((SELECT id FROM glossary WHERE keyword = 'XML'), 'Extensible Markup Language'),
    ((SELECT id FROM glossary WHERE keyword = 'XML'), 'Markup Language'),
    ((SELECT id FROM glossary WHERE keyword = 'XML'), 'Structured Data'),

    ((SELECT id FROM glossary WHERE keyword = 'Autorisierung'), 'Zugriffsberechtigung'),
    ((SELECT id FROM glossary WHERE keyword = 'Autorisierung'), 'Berechtigungsvergabe'),
    ((SELECT id FROM glossary WHERE keyword = 'Autorisierung'), 'Zugriffskontrolle');


INSERT INTO glossary_sources (name_, url, type_, term_id)
VALUES
    ('IT-Grundschutz-Kompendium, Edition 2023, Glossar', 'https://www.bsi.bund.de',	'SOURCE', 1),
    ('IT-Grundschutz-Kompendium, Edition 2023, Glossar', 'https://www.bsi.bund.de',	'SOURCE', 2),
    ('IT-Grundschutz-Kompendium, Edition 2023, Glossar', 'https://www.bsi.bund.de',	'SOURCE', 3),
    ('IT-Grundschutz-Kompendium, Edition 2023, Glossar', 'https://www.bsi.bund.de',	'SOURCE', 4),
    ('IT-Grundschutz-Kompendium, Edition 2023, Glossar', 'https://www.bsi.bund.de',	'SOURCE', 5),
    ('IT-Grundschutz-Kompendium, Edition 2023, Glossar', 'https://www.bsi.bund.de',	'SOURCE', 6),
    ('IT-Grundschutz-Kompendium, Edition 2023, Glossar', 'https://www.bsi.bund.de',	'SOURCE', 7),
    ('IT-Grundschutz-Kompendium, Edition 2023, Glossar', 'https://www.bsi.bund.de',	'SOURCE', 8);