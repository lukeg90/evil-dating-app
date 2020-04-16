DROP TABLE IF EXISTS chat_messages;

CREATE TABLE chat_messages(
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chat_messages (message, user_id) VALUES ('Hey everyone', 1);

INSERT INTO chat_messages (message, user_id) VALUES ('Whats up?', 177);

INSERT INTO chat_messages (message, user_id) VALUES ('The owls are not what they seem.', 69);

INSERT INTO chat_messages (message, user_id) VALUES ('This website does not seem evil at all.', 14);

INSERT INTO chat_messages (message, user_id) VALUES ('You are all a bit daft', 1);




