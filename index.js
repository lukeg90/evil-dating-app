const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const db = require("./utils/db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./utils/bc");
const csurf = require("csurf");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const compression = require("compression");

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(express.json());

app.use(express.static("public"));

app.use(
    cookieSession({
        secret: secrets.cookieSecret,
        maxAge: 1000 * 60 * 60
    })
);

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// ensure that if the user is not logged out, the url is not /welcome
app.get("/welcome", function(req, res) {
    if (!req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/");
    }
});

app.post("/register", (req, res) => {
    console.log("Req body: ", req.body);
    const { first, last, email, password } = req.body;

    hash(password)
        .then(hashedPw => {
            console.log("hashedPw: ", hashedPw);
            // insert a row in the USERS table
            return db.addUser(first, last, email, hashedPw);
        })
        .then(result => {
            // if insert is successful, add userId in a cookie
            req.session.userId = result.rows[0].id;
            console.log("User ID: ", req.session.userId);
            res.json({
                success: true
            });
        })
        .catch(err => {
            console.log("Error in /register ", err);
            res.json({
                success: false
            });
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    let id;
    // get the user's stored hashed password from the db using the user's email address
    db.getUserByEmail(email)
        .then(({ rows }) => {
            console.log("User: ", rows);
            if (rows[0].signature) {
                req.session.signed = true;
            }
            id = rows[0].id;
            // pass the hashed password to COMPARE along with the password the user typed in the input field
            return compare(password, rows[0].password);
        })
        .then(result => {
            console.log("result of compare: ", result);
            // if they match, COMPARE returns a boolean value of true
            if (result) {
                // store the userId in a cookie
                req.session.userId = id;
                res.json({
                    success: true
                });
            } else {
                // if they don't match, COMPARE returns a boolean value of false and re-render with error message
                res.json({
                    success: false,
                    error: "Password incorrect. Please try again."
                });
            }
        })
        .catch(err => {
            console.log("Login error: ", err);
            res.json({
                success: false
            });
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

// ensure that if the user is logged out, the url is  /welcome
app.get("*", function(req, res) {
    if (req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/welcome");
    }
});

app.listen(port, function() {
    console.log("I'm listening.");
});
