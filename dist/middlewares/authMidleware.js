"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminToken = exports.verifyUserToken = void 0;
const generateToken_1 = require("../utils/generateToken");
const verifyUserToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization denied: No Bearer token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, generateToken_1.decodeToken)(token);
        if (decoded.role !== 'user') {
            return res.status(403).json({ error: 'Access denied: Users only' });
        }
        req.user = decoded; // Attach user info to the request object
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.verifyUserToken = verifyUserToken;
//   Admin verification middleware
const verifyAdminToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization denied: No Bearer token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, generateToken_1.decodeToken)(token);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied: Admins only' });
        }
        req.user = decoded; // Attach user info to the request object
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.verifyAdminToken = verifyAdminToken;
