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
