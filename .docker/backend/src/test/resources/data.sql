DELETE FROM users;

INSERT INTO users (first_name, last_name, mail, verified)
VALUES  ('Norman', 'MacDonald', 'norm.eugene@macdonald.com', FALSE),
        ('Don', 'Rickles', 'mr.warmth@rickles.com', FALSE),
        ('Rodney', 'Dangerfield', 'rodney@dangerfield.com', FALSE);