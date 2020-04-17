const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:luke:postgres@localhost:5432/socialnetwork"
);

exports.addUser = (first, last, email, hashedPw) => {
    const q = `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `;
    const params = [first, last, email, hashedPw];
    return db.query(q, params);
};

exports.getUserByEmail = email => {
    const q = `
        SELECT id, password 
        FROM users
        WHERE email = $1
    `;
    const params = [email];
    return db.query(q, params);
};

exports.getUserById = id => {
    const q = `
        SELECT users.id, first, last, image_url, birthday, gender, seeking, interests, symptoms, about FROM users
        LEFT JOIN user_profiles
        ON user_profiles.user_id = users.id
        WHERE users.id = $1
    `;
    const params = [id];
    return db.query(q, params);
};

exports.addCode = (email, code) => {
    const q = `
        INSERT INTO codes (email, code)
        VALUES ($1, $2)
        RETURNING *
    `;
    const params = [email, code];
    return db.query(q, params);
};

exports.getCode = email => {
    const q = `
        SELECT * FROM codes
        WHERE EMAIL = $1 
        AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
    `;
    const params = [email];
    return db.query(q, params);
};

exports.updatePassword = (email, password) => {
    const q = `
        UPDATE users
        SET password = $2
        WHERE email = $1
    `;
    const params = [email, password];
    return db.query(q, params);
};

exports.addImage = (id, image) => {
    const q = `
        UPDATE users
        SET image_url = $2
        WHERE id = $1
        RETURNING image_url    
    `;
    const params = [id, image];
    return db.query(q, params);
};

exports.upsertUserProfile = (
    id,
    birthday,
    gender,
    seeking,
    interests,
    symptoms,
    about
) => {
    const q = `
        INSERT INTO user_profiles (user_id, birthday, gender, seeking, interests, symptoms, about)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (user_id)
        DO UPDATE SET birthday=$2, gender=$3, seeking=$4, interests=$5, symptoms=$6, about=$7
        RETURNING *
    `;
    const params = [id, birthday, gender, seeking, interests, symptoms, about];
    return db.query(q, params);
};

exports.getRecentUsers = () => {
    const q = `
        SELECT id, first, image_url FROM users
        ORDER BY id DESC
        LIMIT 3
    `;
    return db.query(q);
};

exports.getUsersByQuery = query => {
    const q = `
        SELECT id, first, image_url FROM users
        WHERE first ILIKE $1
        ORDER BY first ASC
    `;
    const params = [query + "%"];
    return db.query(q, params);
};

exports.getFriendshipStatus = (userId, otherId) => {
    const q = `
        SELECT * FROM friendships 
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);
    `;
    const params = [userId, otherId];
    return db.query(q, params);
};

exports.initializeFriendship = (userId, otherId) => {
    const q = `
        INSERT INTO friendships (sender_id, receiver_id)
        VALUES ($1, $2)
    `;
    const params = [userId, otherId];
    return db.query(q, params);
};

exports.acceptFriendship = (userId, otherId) => {
    const q = `
        UPDATE friendships
        SET accepted = true
        WHERE (receiver_id = $1 AND sender_id = $2)
    `;
    const params = [userId, otherId];
    return db.query(q, params);
};

exports.endFriendship = (userId, otherId) => {
    const q = `
        DELETE FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);
    `;
    const params = [userId, otherId];
    return db.query(q, params);
};

exports.getAllUsers = () => {
    const q = `
        SELECT * FROM users
        JOIN user_profiles
        ON user_profiles.user_id = users.id
    `;
    return db.query(q);
};

exports.getConnectionsWannabes = userId => {
    const q = `
        SELECT users.id, first, image_url, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
    `;
    const params = [userId];
    return db.query(q, params);
};

exports.getLastTenMessages = () => {
    const q = `
        SELECT chat_messages.id, message, sent_at, first, image_url, user_id
        FROM chat_messages
        JOIN users
        ON users.id = chat_messages.user_id
        ORDER BY sent_at DESC
        LIMIT 10
    `;
    return db.query(q);
};

exports.addMessage = (msg, userId) => {
    const q = `
        INSERT INTO chat_messages (message, user_id)
        VALUES ($1, $2)
        RETURNING id
    `;
    const params = [msg, userId];
    return db.query(q, params);
};

exports.getMessageById = msgId => {
    const q = `
        SELECT chat_messages.id, message, sent_at, first, image_url, user_id
        FROM chat_messages
        JOIN users
        ON users.id = chat_messages.user_id
        WHERE chat_messages.id = $1
    `;
    const params = [msgId];
    return db.query(q, params);
};

exports.getPrivateMessages = userId => {
    const q = `
        SELECT private_messages.id, message, sent_at, sender_id, receiver_id, first, image_url
        FROM private_messages
        JOIN users
        ON sender_id = users.id
        WHERE (sender_id = $1 OR receiver_id = $1)
        ORDER BY sent_at ASC
    `;
    const params = [userId];
    return db.query(q, params);
};
