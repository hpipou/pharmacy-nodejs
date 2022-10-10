const express = require("express")
const routes = express.Router()
const models = require("../models")
const jwt = require("jsonwebtoken") 
const authentication = require("../middleware/authentication")

////////////////////////////////////////////////
// add comment
////////////////////////////////////////////////
routes.post("", authentication, (req,res)=>{

    const comment = req.body.comment 
    if(comment==undefined || comment==null){return res.status(403).json("COMMENT UNDEFINED")}
    if(!comment.match('^[a-zA-Z0-9 é.]{3,50}$')){return res.status(403).json("COMMENT INCORRECT")}

    const idProduct = req.body.idProduct
    if(idProduct==undefined || idProduct==null){return res.status(403).json("PRODUCT ID UNDEFINED")}
    if(!idProduct.match('^[0-9]{1,10}$')){return res.status(403).json("PRODUCT ID INCORRECT")}

    const token= req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const idUser = tokenDecoded.id

    models.Profil.findOne({attributes:['id'], where:{idUser:idUser}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("YOU NEED COMPLET YOUR PROFIL")
        }else{
            checkProduct(data.id)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // check product
    function checkProduct(myProfil){
        models.Product.findOne({attributes:['id'], where:{id:idProduct}})
        .then((dataProduct)=>{
            if(dataProduct==null){
                return res.status(403).json("PRODUCT NOT FOUND")
            }else{
                addNewComment(idUser, myProfil, idProduct)
            }
        })
        .catch((error)=>{return res.status(500).json(error)})
    }

    // add new product
    function addNewComment(myIdUser,myIdProfil,myidProduct){
        models.Comment.create({
            comment : comment,
            idUser : myIdUser,
            idProfil: myIdProfil,
            idProduct:myidProduct
        })
        .then(()=>{return res.status(201).json("GREAT! COMMENT ADDED")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})
////////////////////////////////////////////////
// edit comment
////////////////////////////////////////////////
routes.put("", (req,res)=>{

    const comment = req.body.comment 
    if(comment==undefined || comment==null){return res.status(403).json("COMMENT UNDEFINED")}
    if(!comment.match('^[a-zA-Z0-9 é.]{3,50}$')){return res.status(403).json("COMMENT INCORRECT")}

    const idComment = req.body.idComment
    if(idComment==undefined || idComment==null){return res.status(403).json("COMMENT ID UNDEFINED")}
    if(!idComment.match('^[0-9]{1,10}$')){return res.status(403).json("COMMENT ID INCORRECT")}

    const idProduct = req.body.idProduct
    if(idProduct==undefined || idProduct==null){return res.status(403).json("PRODUCT ID UNDEFINED")}
    if(!idProduct.match('^[0-9]{1,10}$')){return res.status(403).json("PRODUCT ID INCORRECT")}

    const token= req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const idUser = tokenDecoded.id

    models.Comment.findOne({attributes:['id','idUser'], where:{id:idComment}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("YOU NEED COMPLET YOUR PROFIL")
        }else{
            if(data.idUser==idUser){
                checkProduct()
            }else{
                return res.status(403).json("YOU ARE NOT PUBLISHER")
            }
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // check product
    function checkProduct(){
        models.Product.findOne({attributes:['id'], where:{id:idProduct}})
        .then((dataProduct)=>{
            if(dataProduct==null){
                return res.status(403).json("PRODUCT NOT FOUND")
            }else{
                editComment()
            }
        })
        .catch((error)=>{return res.status(500).json(error)})
    }

    // add new product
    function editComment(){
        models.Comment.update({comment : comment},{where:{id:idComment}})
        .then(()=>{return res.status(201).json("GREAT! COMMENT EDITED")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})
////////////////////////////////////////////////
// show all comments
////////////////////////////////////////////////
routes.get("/:id", (req,res)=>{

    const idProduct = req.params.id
    if(idProduct==undefined || idProduct==null){return res.status(403).json("PRODUCT ID UNDEFINED")}
    if(!idProduct.match('^[0-9]{1,10}$')){return res.status(403).json("PRODUCT ID INCORRECT")}

    models.Comment.findAll({
        attributes:['id','comment'], where:{idProduct:idProduct},
        include:[{model:models.User, attributes:['id','email','username']},
                 {model:models.Profil, attributes:['id','fname','lname','imgURL']}]})
    .then((data)=>{
        if(data.length<1){
            return res.status(403).json("COMMENTS NOT FOUND")
        }else{
            return res.status(200).json(data)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

})


module.exports = routes