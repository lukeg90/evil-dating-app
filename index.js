const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const port = process.env.PORT || 8080;
const db = require("./utils/db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./utils/bc");
const csurf = require("csurf");
const ses = require("./utils/ses");
const cryptoRandomString = require("crypto-random-string");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./utils/s3");
const conf = require("./config");
const { match } = require("./services");
const moment = require("moment");

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

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.json());

app.use(express.static("public"));

const cookieSessionMiddleware = cookieSession({
    secret: secrets.cookieSecret,
    maxAge: 1000 * 60 * 60
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    // verify email address is in users table
    db.getUserByEmail(email)
        .then(({ rows }) => {
            if (rows.length > 0) {
                const secretCode = cryptoRandomString({
                    length: 6
                });
                // insert secret code into new table
                return db.addCode(email, secretCode);
            } else {
                res.json({
                    success: false,
                    error: "This email address has not been registered"
                });
                throw new Error("Email address not found in table");
            }
        })
        .then(({ rows }) => {
            console.log("Code added to table successfully: ", rows[0]);
            // send email
            return ses.sendEmail(
                rows[0].email,
                "Corona Love Password reset",
                `You recently requested a password reset. Please enter the following code to reset your password: ${rows[0].code}`
            );
        })
        .then(() => {
            res.json({
                success: true
            });
        })
        .catch(err => {
            console.log("Error in password reset start: ", err);
            res.json({
                success: false
            });
        });
});

app.post("/password/reset/verify", (req, res) => {
    const { email, code, newPassword } = req.body;
    console.log("Email: ", email);
    // find code in database by email address
    db.getCode(email)
        .then(({ rows }) => {
            console.log("code in db: ", rows[rows.length - 1].code);
            // compare req.body.code with most recent code in database
            if (code == rows[rows.length - 1].code) {
                // hash password
                return hash(newPassword);
            } else {
                res.json({
                    success: false,
                    error: "Code does not match"
                });
                throw new Error("Code does not match");
            }
        })
        .then(hashedPw => {
            // update users table with new password
            return db.updatePassword(email, hashedPw);
        })
        .then(() => {
            res.json({
                success: true
            });
        })
        .catch(err => {
            console.log("Error verifying code", err);
            res.json({ success: false });
        });
});

app.get("/user", (req, res) => {
    db.getUserById(req.session.userId)
        .then(({ rows }) => {
            console.log("user data: ", rows[0]);
            console.log("Image URL: ", rows[0].image_url);
            res.json({
                id: rows[0].id,
                first: rows[0].first,
                last: rows[0].last,
                imgUrl: rows[0].image_url,
                birthday: rows[0].birthday,
                gender: rows[0].gender,
                seeking: rows[0].seeking,
                interests: rows[0].interests,
                symptoms: rows[0].symptoms,
                about: rows[0].about
            });
        })
        .catch(err => {
            console.log("Error getting user from db: ", err);
        });
});

app.post("/user/image", uploader.single("image"), s3.upload, (req, res) => {
    console.log("file: ", req.file);
    let imageUrl = conf.s3Url + req.file.filename;
    db.addImage(req.session.userId, imageUrl)
        .then(({ rows }) => {
            console.log("Successfully added image to db: ", rows[0].image_url);
            res.json({
                success: true,
                imgUrl: rows[0].image_url
            });
        })
        .catch(err => {
            console.log("Error adding image to db ", err);
            res.json({
                success: false
            });
        });
});

app.post("/user/profile/update", async (req, res) => {
    console.log("profile data from frontend: ", req.body.profile);
    let {
        birthday,
        gender,
        seeking,
        interests,
        symptoms,
        about
    } = req.body.profile;
    try {
        const { rows } = await db.upsertUserProfile(
            req.session.userId,
            birthday,
            gender,
            seeking,
            interests,
            symptoms,
            about
        );
        console.log("User profile successfully updated: ", rows);
        res.json({
            success: true,
            updatedProfile: rows[0]
        });
    } catch (err) {
        console.log("Error updating user profile: ", err);
        res.json({ success: false });
    }
});

app.get("/user/:id.json", async (req, res) => {
    try {
        const { rows } = await db.getUserById(req.params.id);
        console.log("successfully fetched other profile: ", rows[0]);
        const {
            id,
            first,
            last,
            image_url,
            birthday,
            gender,
            seeking,
            interests,
            about
        } = rows[0];
        res.json({
            success: true,
            id: id,
            first: first,
            last: last,
            imgUrl: image_url,
            birthday: birthday,
            gender: gender,
            seeking: seeking,
            interests: interests,
            about: about
        });
    } catch (err) {
        console.log("Error fetching other user profile: ", err);
        res.json({ success: false });
    }
});

app.get("/matches.json", (req, res) => {
    console.log("Query: ", req.query.q);
    // first get current user and all users
    let loggedInUser;
    let allUsers;
    let matches;
    db.getUserById(req.session.userId)
        .then(({ rows }) => {
            loggedInUser = rows[0];
            // only gets users who have added a profile
            return db.getAllUsers();
        })
        .then(({ rows }) => {
            allUsers = rows;
            // match-making logic here
            matches = match(loggedInUser, allUsers);
            console.log("Matches: ", matches);
            // send only matches who are not already connections
            // need to get all connections and then filter matches
            return db.getConnections(req.session.userId);
        })
        .then(({ rows }) => {
            console.log("All connections: ", rows);
            const connections = rows;
            // remove match if they are already connection
            connections.forEach(connection => {
                // use reverse loop so index isn't messed up
                for (let i = matches.length - 1; i >= 0; i--) {
                    if (connection.id == matches[i].id) {
                        matches.splice(i, 1);
                    }
                }
            });
            console.log("Matches after crazy loops: ", matches);
            if (!req.query.q) {
                res.json({ success: true, users: matches });
            } else {
                const queryMatches = matches.filter(match =>
                    match.first
                        .toLowerCase()
                        .startsWith(req.query.q.toLowerCase())
                );
                res.json({ success: true, users: queryMatches });
            }
        })
        .catch(err => {
            console.log("error getting matches: ", err);
            res.json({ success: false });
        });
});

app.get("/initial-friendship-status/:otherUserId", async (req, res) => {
    console.log("other user ID: ", req.params.otherUserId);
    try {
        const { rows } = await db.getFriendshipStatus(
            req.session.userId,
            req.params.otherUserId
        );
        console.log("Friendship status: ", rows);
        if (!rows[0]) {
            res.json({ success: false });
        } else if (rows[0].accepted) {
            res.json({ success: true, accepted: true });
        } else if (
            !rows[0].accepted &&
            rows[0].sender_id == req.params.otherUserId
        ) {
            res.json({ success: true, awaitingUserAction: true });
        } else if (
            !rows[0].accepted &&
            rows[0].sender_id == req.session.userId
        ) {
            res.json({ success: true, awaitingOtherAction: true });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.log("Error determining friendship status: ", err);
    }
});

app.post("/make-friend-request/:otherUserId", async (req, res) => {
    try {
        await db.initializeFriendship(
            req.session.userId,
            req.params.otherUserId
        );
        res.json({ success: true });
    } catch (err) {
        console.log("Error initializing friendship: ", err);
        res.json({ success: false });
    }
});

app.post("/add-friendship/:otherUserId", async (req, res) => {
    try {
        await db.acceptFriendship(req.session.userId, req.params.otherUserId);
        res.json({ success: true });
    } catch (err) {
        console.log("Error accepting friend request");
        res.json({ success: false });
    }
});

app.post("/end-friendship/:otherUserId", async (req, res) => {
    try {
        await db.endFriendship(req.session.userId, req.params.otherUserId);
        res.json({ success: true });
    } catch (err) {
        console.log("Error ending friendship", err);
        res.json({ success: false });
    }
});

app.get("/connections-wannabes", async (req, res) => {
    try {
        const { rows } = await db.getConnectionsWannabes(req.session.userId);
        console.log("Connections and wannabes: ", rows);
        res.json({ success: true, connectionsWannabes: rows });
    } catch (err) {
        console.log("unable to get connections and wannabes from db: ", err);
    }
});
// ensure that if the user is logged out, the url is  /welcome
app.get("*", function(req, res) {
    if (req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/welcome");
    }
});

server.listen(port, function() {
    console.log("I'm listening.");
});

////// PRIVATE MESSAGING //////

// for private messaging, need to maintain a list of socket ids and the user ids that the sockets belong to
let socketIds = [];

io.on("connection", async function(socket) {
    const userId = socket.request.session.userId;

    if (!userId) {
        return socket.disconnect(true);
    }

    console.log(`Socket with the id ${socket.id} is now connected`);

    // push socket id and user to array of socket ids

    socketIds.push({
        id: socket.id,
        userId
    });

    // get private messages where sender or receiver id = userId
    try {
        const privateMessages = await db.getPrivateMessages(userId);
        console.log("Private messages: ", privateMessages.rows);

        //format timestamps
        privateMessages.rows.forEach(row => {
            row.date = moment(row.sent_at).format("ddd, D MMMM");
            row.sent_at = moment(row.sent_at).format("HH:mm");
        });
        const socketsToEmitTo = socketIds.filter(
            socketId => socketId.userId === userId
        );

        console.log("Sockets to emit to: ", socketsToEmitTo);

        for (let i = 0; i < socketsToEmitTo.length; i++) {
            io.to(socketsToEmitTo[i].id).emit(
                "privateMessages",
                privateMessages.rows
            );
        }
    } catch (err) {
        console.log("Error getting private messages from db", err);
    }

    // emit private messages to all sockets of user
    // check socketIds array to get all socket ids belonging to logged in user

    // on disconnect, remove socket from array of socket ids

    socket.on("disconnect", function() {
        let remainingSocketIds = socketIds.filter(
            socketId => socketId.id != socket.id
        );
        socketIds = remainingSocketIds;
        console.log("open sockets: ", socketIds);
    });

    // // ADDING A NEW PRIVATE MSG

    socket.on("newPrivateMessage", async data => {
        console.log("new private message from chat: ", data.message);
        console.log("receiver of private message: ", data.receiver);
        console.log("user who sent the message: ", userId);

        // store new private message in database and return its id

        const pmId = await db.addPrivateMessage(
            data.message,
            userId,
            data.receiver
        );
        console.log("PM ID: ", pmId.rows[0].id);

        // get message by ID from database and join info about sender

        const pmAndSenderInfo = await db.getPmById(pmId.rows[0].id);

        const pmToEmit = pmAndSenderInfo.rows[0];

        // format timestamp

        pmToEmit.date = moment(pmToEmit.sent_at).format("ddd, D MMMM");
        pmToEmit.sent_at = moment(pmToEmit.sent_at).format("HH:mm");

        // emit new private message to all sender and recipient sockets

        socketIds.forEach(socketId => {
            if (
                socketId.userId == pmToEmit.sender_id ||
                socketId.userId == pmToEmit.receiver_id
            ) {
                io.to(socketId.id).emit("addPm", pmToEmit);
            }
        });
    });
});
