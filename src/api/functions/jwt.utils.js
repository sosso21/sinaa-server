const jwt = require('jsonwebtoken');
const config = require('./config.js');

const JWT_SIGN_SECRET = config.JWT_SIGN_SECRET;

// Exported functions
module.exports = {
    generateTokenForUser: (userData, expireIn = (60*15), suplement = null) => {

        let payload = {
            userId: userData.id,
            status: userData.status
        };
        if (suplement != null) 
        {
            payload = Object.assign(payload, suplement);
        }


        return jwt.sign(
            payload,
            JWT_SIGN_SECRET, {
                expiresIn: expireIn // sexonde
            })
    },
    parseAuthorization: (authorization) => {
        
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getUserInfo: (authorization) => {
        let info = -1;
        const token = module.exports.parseAuthorization(authorization);
        if (token != null) {

            try {
                const jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if (jwtToken != null)
                    info = jwtToken;

            } catch (err) {}
        }
        
        return info;
    }
}