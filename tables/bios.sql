DROP TABLE IF EXISTS bios;

CREATE TABLE bios(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    gender VARCHAR(255) NOT NULL,
    symptoms VARCHAR(255)[],
    about TEXT
)