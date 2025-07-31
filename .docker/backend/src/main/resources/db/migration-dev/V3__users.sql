INSERT INTO users (first_name, last_name, mail, password, verified)
VALUES  ('Don', 'Rickles', 'mr.warmth@rickles.com', '$2a$10$mVHHBtNheYaZthpORyJiVeFmsbE5yUcIuGzUS05nbCXN8Rj1yTU8m', TRUE),
        ('Rodney', 'Dangerfield', 'rodney@dangerfield.com', '$2a$10$mVHHBtNheYaZthpORyJiVeFmsbE5yUcIuGzUS05nbCXN8Rj1yTU8m', TRUE);

INSERT INTO users_to_roles (user_id, role_id)
VALUES  (1, 2),
        (2, 2);

INSERT INTO jwt_token (user_id, active, expiry_date, issued_at, token)
VALUES  (1, TRUE, TIMESTAMP '2025-12-22 15:35:31.422148', TIMESTAMP '2024-12-18 15:35:31.422148', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzM0NTMyNTMxLCJleHAiOjE3MzQ4NzgxMzF9.YMWcarKQu3KZBJh6Z8DoxlRBhrOkBgsIBqHNMAPpO1w'),
        (2, TRUE, TIMESTAMP '2025-12-22 15:36:21.510852', TIMESTAMP '2024-12-18 15:36:21.510852', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzM0NTMyNTgxLCJleHAiOjE3MzQ4NzgxODF9.R888POmhgC0YrGH9voOnYyKgc_72SjQZSBLOfrkk3wM');