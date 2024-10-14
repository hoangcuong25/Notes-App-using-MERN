const jwt = require("jsonwebtoken")

function authenticateToken(req, res, next) {
    const authHeader = req.headers["Authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, user) => {
        if (err) return res.sendStatus(401);
        req.user = user;
        next();
    })
}

module.exports = {
    authenticateToken,
}