INSERT INTO security_standard (id, name_, website, parent_id, description)
VALUES
    (1, 'BSI Grundschutz', 'https://www.bsi.bund.de', NULL, 'Der IT-Grundschutz des BSI ist ein deutscher Sicherheitsstandard, der systematisch Maßnahmen, Methoden und Prozesse definiert, um IT-Systeme vor Bedrohungen zu schützen und Informationssicherheit zu gewährleisten.'),
    (2, 'Anwendungen', '', 1, 'Der Baustein "Anwendungen" behandelt die Sicherheit von Anwendungen, von der Entwicklung über den Betrieb bis hin zur Wartung, einschließlich sicherer Programmierung und Anwendungsmanagement.'),
    (3, 'Detektion', '', 1, 'Der Baustein "Detektion und Reaktion" fokussiert sich auf die Erkennung von Sicherheitsvorfällen und die angemessene Reaktion darauf, einschließlich der Überwachung von IT-Systemen und der Incident-Response-Prozesse.'),
    (4, 'Betrieb', '', 1, 'Der Baustein "Betrieb" umfasst Maßnahmen, die für den sicheren IT-Betrieb erforderlich sind, einschließlich des Betriebs von IT-Systemen, der Verwaltung von Benutzerkonten und des Patch-Managements.'),
    (5, 'Infrastruktur', '', 1, 'Der Baustein "Infrastruktur" bezieht sich auf die physische Sicherheit und die grundlegende Infrastruktur, wie Gebäude, Räume und Verkabelung, um den Schutz der IT-Systeme zu gewährleisten.'),
    (6, 'Netze', '', 1, 'Der Baustein "Netze" beschreibt die Sicherheitsanforderungen an Netzwerke, einschließlich der Netzwerkarchitektur, Verschlüsselung und Zugangskontrollen.'),
    (7, 'Systeme', '', 1, 'Der Baustein "Systeme" umfasst die Sicherheit einzelner IT-Systeme, wie Server, Clients und mobile Geräte, sowie deren Konfiguration und Schutzmaßnahmen.');


INSERT INTO security_standard_controls (element_id, control_id)
VALUES
    (1, 400),
    (2, 5),
    (3, 6),
    (4, 3),
    (6, 10),
    (7, 8),
    (7, 9);