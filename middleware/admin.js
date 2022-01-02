module.exports = async function(req, res, next) {
    const admin = req.user.isAdmin;
    if ( ! admin ) return res.status(403).send("Sorry you do not have permission");
    next();
};