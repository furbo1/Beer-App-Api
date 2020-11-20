 const jwt = require('jsonwebtoken');
 const config = require('../config/config');
 const User = require('../user/user.model')
 
 
 const authMiddleware = (permissions) => {
    return async function (req, res, next) {
        try{
            var token = req.headers['authorization'];
            let decoded = await jwt.verify(token,config.secret);

            if(decoded.params.id) {
                let user = await User.findOne({_id: decoded.params.id});
                let checkPermission = permissions.filter(permission => {
                    return permission == user.role
                })
                if(checkPermission.length > 0 ) {
                    return next();
                }else {
                    return res.status(400).json({ message: "User doesn't have a valid permission!"})
                }
            }else {
                return res.status(400).json({ message: 'Token is not valid!'})
            }
        }catch(err) {
            return res.status(400).json(err);
        }
    }

}

module.exports = authMiddleware;


