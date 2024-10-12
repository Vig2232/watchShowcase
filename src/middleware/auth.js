const jwt = require('jsonwebtoken');
const config = require('../../config.json')

exports.authorize = (roles) => async (req, res, next) => {
    try {
        const { User } = global.sequelize;
        const token = req.headers.authorization;
        if (!token)
            return res.status(403).send({ 'success': false, 'message': "Forbidden Making a request that isn’t allowed." });
        const decoded = jwt.verify(token, config.Token_secret);

        let check = await User.findOne({ where: { mobile_number: decoded.mobile_number } });

        if (!check) return res.json({ ...responce, status: false, message: 'User not found' });

        if (Date.now() >= decoded.exp * 1000) return res.status(400).json({ success: false, message: "Token expired" });

        if (!roles.includes(decoded.user_type)) return res.status(400).json({ success: false, message: "Access denied" });

        req.userId = decoded.id;
        req.userName = decoded.user_name;
        req.mobileNumber = decoded.mobile_number;
        req.user_type = decoded.user_type;
        next();
    } catch (err) {
        return res.status(401).send({ 'success': false, message: 'Failed to authenticate token.' });
    }
}