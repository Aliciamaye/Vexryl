// /api/utils/jwt.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'vexryl_secret';

exports.createJWT = (userId) => jwt.sign({ userId }, SECRET, { expiresIn: '7d' });
