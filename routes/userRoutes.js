const express = require("express")
const routes = express.Router()
const models = require("../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const authentifcation = require("../middleware/authentication")

/////////////////////////////////////////////////////////
// add new user
/////////////////////////////////////////////////////////
routes.post("/register",(req,res)=>{

    const email = req.body.email
    const username= req.body.username
    const password=req.body.password

    if(email==null || email == undefined){return res.status(403).json("EMAIL UNDEFINED")}
    if(username==null || username == undefined){return res.status(403).json("USERNAME UNDEFINED")}
    if(password==null || password == undefined){return res.status(403).json("PASSWORD UNDEFINED")}

    if(!email.match('^[a-zA-Z0-9_@.]{5,30}$')){return res.status(403).json("EMAIL NOT ACCEPTED")}
    if(!username.match('^[a-zA-Z0-9]{5,15}$')){return res.status(403).json("USERNAME NOT ACCEPTED")}
    if(!password.match('^[a-zA-Z0-9]{5,15}$')){return res.status(403).json("PASSWORD NOT ACCEPTED")}

    // check if email is exist
    models.User.findOne({attributes:['id'], where:{email:email}})
    .then((data)=>{
        if(data==null){
            checkUsername(username)
        }else{
            return res.status(403).json("EMAIL ALREADY EXIST")
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // check if username exist
    function checkUsername(aUsername){
        models.User.findOne({attributes:['id'], where:{username:aUsername}})
        .then((data)=>{
            if(data==null){
                // if username is available, we create a new user
                createUser(email,username,password)
    
            }else{
                return res.status(403).json("USERNAME ALREADY EXIST")
            }
        })
        .catch((error)=>{return res.status(500).json(error)})
    }

    // create new USER
    function createUser(bEmail,bUsername,bPassword){
        models.User.create({
            email : bEmail,
            username: bUsername,
            password: bcrypt.hashSync(bPassword,10),
            status:"active",
            roleName:"USER",
            isProfil:false
        })
        .then(()=>{return res.status(201).json("GREAT! ACCOUNT CREATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})

/////////////////////////////////////////////////////////
// login user 
/////////////////////////////////////////////////////////
routes.post("/login",(req,res)=>{

    const email = req.body.email
    const password=req.body.password

    if(email==null || email == undefined){return res.status(403).json("EMAIL UNDEFINED")}
    if(password==null || password == undefined){return res.status(403).json("PASSWORD UNDEFINED")}

    if(!email.match('^[a-zA-Z0-9_@.]{5,30}$')){return res.status(403).json("EMAIL NOT ACCEPTED")}
    if(!password.match('^[a-zA-Z0-9]{5,15}$')){return res.status(403).json("PASSWORD NOT ACCEPTED")}

    // check if email is exist
    models.User.findOne({attributes:['id','username','password','status','roleName','isProfil'], where:{email:email}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("USER NOT FOUND")
        }else{
            if(bcrypt.compareSync(password, data.password)){
                const token = jwt.sign({
                    id:data.id,
                    username:data.username,
                    status:data.status,
                    roleName:data.roleName,
                    isProfil:data.isProfil
                },
                process.env.SECTOKEN
                ,{expiresIn:'48h'})
                return res.status(200).json(token)
            }else{
                return res.status(403).json("INCORRECT PASSWORD")
            }

        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    
})


/////////////////////////////////////////////////////////
// edit password
/////////////////////////////////////////////////////////
routes.put("/password", authentifcation, (req,res)=>{

    const email = req.body.email
    const password=req.body.password

    if(email==null || email == undefined){return res.status(403).json("EMAIL UNDEFINED")}
    if(password==null || password == undefined){return res.status(403).json("PASSWORD UNDEFINED")}

    if(!email.match('^[a-zA-Z0-9_@.]{5,30}$')){return res.status(403).json("EMAIL NOT ACCEPTED")}
    if(!password.match('^[a-zA-Z0-9]{5,15}$')){return res.status(403).json("PASSWORD NOT ACCEPTED")}

    // check if email is exist
    models.User.findOne({attributes:['password'], where:{email:email}})
    .then((data)=>{
        
        if(data==null){
            return res.status(403).json("USER NOT FOUND")
        }else{
            
            if(bcrypt.compareSync(password, data.password)){ 
                editPassword(email,password)
            }else{
                return res.status(403).json("INCORRECT PASSWORD")
            }
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // edit password
    function editPassword(myEmailo,myPasswordo){ 
        models.User.update({password:bcrypt.hashSync(myPasswordo,10)},{where:{email:myEmailo}})
        .then(()=>{return res.status(200).json("PASSWORD UPDATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})

/////////////////////////////////////////////////////////
// edit username
/////////////////////////////////////////////////////////
routes.put("/username", authentifcation, (req,res)=>{

    const email = req.body.email
    const username= req.body.username
    const newUsername = req.body.newUsername
    const password=req.body.password

    if(email==null || email == undefined){return res.status(403).json("EMAIL UNDEFINED")}
    if(username==null || username == undefined){return res.status(403).json("USERNAME UNDEFINED")}
    if(newUsername==null || newUsername == undefined){return res.status(403).json("NEW USERNAME UNDEFINED")}
    if(password==null || password == undefined){return res.status(403).json("PASSWORD UNDEFINED")}

    if(!email.match('^[a-zA-Z0-9_@.]{5,30}$')){return res.status(403).json("EMAIL NOT ACCEPTED")}
    if(!username.match('^[a-zA-Z0-9]{5,15}$')){return res.status(403).json("USERNAME NOT ACCEPTED")}
    if(!newUsername.match('^[a-zA-Z0-9]{5,15}$')){return res.status(403).json("NEW USERNAME NOT ACCEPTED")}
    if(!password.match('^[a-zA-Z0-9]{5,15}$')){return res.status(403).json("PASSWORD NOT ACCEPTED")}

    // check if email is exist
    models.User.findOne({attributes:['password'], where:{email:email}})
    .then((data)=>{
        
        if(data==null){
            return res.status(403).json("USER NOT FOUND")
        }else{
            
            if(bcrypt.compareSync(password, data.password)){ 
                editUsername(email,newUsername)
            }else{
                return res.status(403).json("INCORRECT PASSWORD")
            }
        }

    })
    .catch((error)=>{return res.status(500).json(error)})

    // edit username
    function editUsername(myEmailo,myNewUsername){ 
        models.User.update({username:myNewUsername},{where:{email:myEmailo}})
        .then(()=>{return res.status(200).json("USERNAME UPDATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})

/////////////////////////////////////////////////////////
// show one user
/////////////////////////////////////////////////////////
routes.get("/:id", (req,res)=>{

    const id = req.params.id

    if(id==null || id == undefined){return res.status(403).json("USED ID UNDEFINED")}
    if(!email.match('^[0-9]*$')){return res.status(403).json("USER ID INCORRECT")}
 
    models.User.findAll({attributes:['id','email','username','status','roleName','isProfil'], where:{id:id}})
    .then((data)=>{return res.status(200).json(data)})
    .catch((error)=>{return res.status(500).json(error)})

})

/////////////////////////////////////////////////////////
// show all users
/////////////////////////////////////////////////////////
routes.get("",(req,res)=>{

    models.User.findAll({attributes:['id','email','username','status','roleName','isProfil']})
    .then((data)=>{return res.status(200).json(data)})
    .catch((error)=>{return res.status(500).json(error)})

})

/////////////////////////////////////////////////////////
// delete user
/////////////////////////////////////////////////////////
routes.delete("",authentifcation,(req,res)=>{

    const tokenBearer = req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(tokenBearer)
    const idUser = tokenDecoded.id

    models.User.destroy({where:{id:idUser}})
    .then(()=>{return res.status(200).json("USER DELETED")})
    .catch((error)=>{return res.status(500).json(error)})

})


module.exports = routes