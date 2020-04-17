DROP TABLE IF EXISTS private_messages;

CREATE TABLE private_messages(
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    receiver_id INTEGER NOT NULL REFERENCES users(id),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO private_messages (message, sender_id, receiver_id) VALUES ('Hey June', 1, 177);

INSERT INTO private_messages (message, sender_id, receiver_id) VALUES ('Hey cutie, whats up?', 177, 1);

INSERT INTO private_messages (message, sender_id, receiver_id) VALUES ('What are you wearing?', 177, 1);

INSERT INTO private_messages (message, sender_id, receiver_id) VALUES ('Face mask and plastic visor', 1, 177);

INSERT INTO private_messages (message, sender_id, receiver_id) VALUES ('Sexy', 177, 1);







