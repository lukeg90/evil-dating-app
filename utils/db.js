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
