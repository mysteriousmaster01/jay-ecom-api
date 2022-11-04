const jwt = require("jsonwebtoken");

const veriftToken = (req, res, next) => {
    const authHeader = req.headers.token
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) {
                res.status(403).json("Token is not valid!");
            }
            req.user = user;
            next();
        })
    }
    else {
        return res.status(401).json("You are not authenticated!");
    }
}

const veriftTokenAndAuthorization = (req, res, next) => {
    veriftToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }
        else {
            res.status(403).json("You are not allowed to perform the operation!");
        }
    });
};

const veriftTokenAndAdmin = (req, res, next) => {
    veriftToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        }
        else {
            res.status(403).json("You are not allowed to perform the operation!");
        }
    });
};

module.exports = {
    veriftToken,
    veriftTokenAndAuthorization,
    veriftTokenAndAdmin
};