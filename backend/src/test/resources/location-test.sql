INSERT INTO countries (id, name_, code)
VALUES
    (1, 'Deutschland', 'DE');

INSERT INTO federal_states (id, name_, country_id, code)
VALUES
    (1, 'Brandenburg', 1, 'BB'),
    (2, 'Berlin', 1, 'BE'),
    (3, 'Baden-Württemberg', 1, 'BW'),
    (4, 'Bayern', 1, 'BY'),
    (5, 'Bremen', 1, 'HB'),
    (6, 'Hessen', 1, 'HE'),
    (7, 'Hamburg', 1, 'HH'),
    (8, 'Mecklenburg-Vorpommern', 1, 'MV'),
    (9, 'Niedersachsen', 1, 'NI'),
    (10, 'Nordrhein-Westfalen', 1, 'NW'),
    (11, 'Rheinland-Pfalz', 1, 'RP'),
    (12, 'Schleswig-Holstein', 1, 'SH'),
    (13, 'Saarland', 1, 'SL'),
    (14, 'Sachsen', 1, 'SN'),
    (15, 'Sachsen-Anhalt', 1, 'ST'),
    (16, 'Thüringen', 1, 'TH');

INSERT INTO counties (id, name_, federal_state_id, code)
VALUES
    (1, 'Freiburg im Breisgau', 3, '08311'),
    (2, 'Landkreis Heilbronn', 3, '08125');

INSERT INTO locations (id, postal_code, name_, county_id)
VALUES
    (1, '79098', 'Freiburg im Breisgau', 1),
    (2, '74182', 'Obersulm', 2);