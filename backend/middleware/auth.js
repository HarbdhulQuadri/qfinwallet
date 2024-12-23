const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'No token provided'
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add userID to request query
        req.query.userID = decoded.userID;

        next();
    } catch (error) {
        console.error('Auth Error:', error);
        return res.status(401).json({
            status: 'error',
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authMiddleware;
