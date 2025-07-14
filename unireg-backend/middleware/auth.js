const jwt = require('jsonwebtoken');

module.exports = {
    auth: (req, res, next) => {
        try {
            const token = req.header('Authorization').replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).send({ error: 'Please authenticate.' });
        }
    },

    admin: (req, res, next) => {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ error: 'Access denied. Admin only.' });
        }
        next();
    }
};
