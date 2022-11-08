import jwt from 'jsonwebtoken';
import jwtConfig from '../../config/jwt.js'

export default {
    verifyToken: (token, callback) => jwt.verify(token, jwtConfig.publicKEY, callback),
    createToken: (data) => jwt.sign(data, jwtConfig.privateKEY, { expiresIn: jwtConfig.ttl, algorithm: jwtConfig.algorithm })
};