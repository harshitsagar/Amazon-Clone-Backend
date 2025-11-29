const jwt = require('jsonwebtoken');

// Auth Middleware .....
const auth = (req, res, next) => {

    try {

        // Get token from header .....
        const token = req.header("x-auth-token");
        if (!token) return res.status(401).json({msg: "No authentication token, access denied!"});

        // Verify the token .....
        const verified = jwt.verify(token, "passwordKey");
        if (!verified) return res.status(401).json({msg: "Token verification failed, authorization denied!"});

        // Add the user id to the req object .....
        req.user = verified.id;
        req.token = token;
        next();

    } catch (e) {
        res.status(500).json({error: e.message});
    }

}

module.exports = auth;





