const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = async function(req, res, next) {
    const token = req.header('x-auth-token');
    if ( ! token ) return res.status(400).send("Access denied. No token is provided");

    try{
        const decoded = jwt.verify( token, config.get('jwtPrivateKey') );
        req.user = decoded;
        next();
    }
    catch(ex) {
        res.send("Invalid token");
    }
};