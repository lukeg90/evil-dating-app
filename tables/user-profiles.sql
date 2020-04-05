DROP TABLE IF EXISTS user_profiles;

CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    birthday date NOT NULL,
    gender VARCHAR(255) NOT NULL,
    seeking VARCHAR(255) NOT NULL,
    interests VARCHAR(255)[],
    symptoms VARCHAR(255)[],
    about TEXT
);