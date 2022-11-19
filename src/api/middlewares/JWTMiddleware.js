import jwt from '../utils/jwt.js'

export default (req, res, next) => {    
    const authToken = req.headers.authorization.replace('Bearer ', '');

    jwt.verifyToken(authToken, (err, tokenData) => {

        if (err) {
            res.status(403).end();
            return;
        }

        req.tokenData = tokenData;
        req.authValid = true;
        next();
    });

};