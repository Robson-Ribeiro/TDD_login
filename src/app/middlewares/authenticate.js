require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = async (req, res, next) => {
    const auth = req.headers.authorization;

    if(!auth) {
        return res.status(401).json({ error: "Missing Token" });
    }

    const [, token] = auth.split(" ");

    try{
        const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET);
        req.userId = decoded.id;
        return next();
    }catch(e) {
        res.status(401).json({ error: "Invalid Token"});
    };
};