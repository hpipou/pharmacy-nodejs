const jwt = require("jsonwebtoken")
require("dotenv").config()

const auth = (req,res, next)=>{

    if(req.headers.authorization==null || req.headers.authorization == undefined){return res.status(403).json("TOKEN UNDEFINED")}

    try{
        const token = req.headers.authorization.split(' ')[1]
        if(jwt.verify(token,process.env.SECTOKEN)){
            next()
        }else{
            return res.status(403).json("INVALID TOKEN")
        }

    }catch{
        return res.status(403).json("INVALID TOKEN")
    }

}

module.exports = auth