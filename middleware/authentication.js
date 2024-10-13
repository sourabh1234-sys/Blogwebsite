const {tokenvaild} = require('../services/auth')


function checkauthenticationcookie(cookie) {
    return (req , res , next) => {
        const cookievalue = req.cookies[cookie]
        if(!cookievalue)  return next();

        try {
            const payload = tokenvaild(cookievalue)
            req.user = payload
        } catch (error) {
            console.log(error);
            
        }
        return next();
    }
}

module.exports = {
    checkauthenticationcookie
}