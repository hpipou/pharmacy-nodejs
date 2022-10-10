const express = require("express")
const routes = express.Router()
const models = require("../models")
const jwt = require("jsonwebtoken") 
const authentication = require("../middleware/authentication")

////////////////////////////////////////////////
// add / edit rating
////////////////////////////////////////////////
routes.post("", authentication, (req,res)=>{

    const rating = req.body.rating 
    if(rating==undefined || rating==null){return res.status(403).json("RATING UNDEFINED")}
    if(!rating.match('^[012345]$')){return res.status(403).json("RATING INCORRECT")}

    const idProduct = req.body.idProduct
    if(idProduct==undefined || idProduct==null){return res.status(403).json("PRODUCT ID UNDEFINED")}
    if(!idProduct.match('^[0-9]{1,10}$')){return res.status(403).json("PRODUCT ID INCORRECT")}

    const token= req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const idUser = tokenDecoded.id

    // check if rating exist or not
    models.Rating.findOne({attributes:['id'], where:{idUser:idUser, idProduct:idProduct}})
    .then((data)=>{
        if(data==null){
            findProfilID(0)
        }else{
            findProfilID(1)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // find profil id
    function findProfilID(eduqation){
        models.Profil.findOne({attributes:['id'], where:{idUser:idUser}})
        .then((data)=>{
            if(data==null){
                return res.status(403).json("YOU NEED COMPLET YOUR PROFIL")
            }else{
                checkProduct(data.id, eduqation)
            }
        })
        .catch((error)=>{return res.status(500).json(error)})
    }

    // check product
    function checkProduct(myProfil, eduqation){
        models.Product.findOne({attributes:['id'], where:{id:idProduct}})
        .then((dataProduct)=>{
            if(dataProduct==null){
                return res.status(403).json("PRODUCT NOT FOUND")
            }else{
                if(eduqation==0){
                    addNewRating(idUser, myProfil, idProduct)
                }else{
                    editRating()
                }
            }
        })
        .catch((error)=>{return res.status(500).json(error)})
    }

    // add new rating
    function addNewRating(myIdUser,myIdProfil,myidProduct){
        models.Rating.create({
            rating_note : rating,
            idUser : myIdUser,
            idProfil: myIdProfil,
            idProduct:myidProduct
        })
        .then(()=>{return res.status(201).json("GREAT! RATING ADDED")})
        .catch((error)=>{return res.status(500).json(error)})
    }

    // edit rating
    function editRating(){
        models.Rating.update({rating_note : rating}, {where:{idUser:idUser, idProduct:idProduct}})
        .then(()=>{return res.status(201).json("GREAT! RATING EDITED")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})

////////////////////////////////////////////////
// show all rating
////////////////////////////////////////////////
routes.get("/:id", (req,res)=>{

    const idProduct = req.params.id
    if(idProduct==undefined || idProduct==null){return res.status(403).json("PRODUCT ID UNDEFINED")}
    if(!idProduct.match('^[0-9]{1,10}$')){return res.status(403).json("PRODUCT ID INCORRECT")}

    models.Rating.findAll({
        attributes:['id','rating_note'], where:{idProduct:idProduct},
        include:[{model:models.User, attributes:['id','email','username']},
                 {model:models.Profil, attributes:['id','fname','lname','imgURL']}]})
    .then((data)=>{
        if(data.length<1){
            return res.status(403).json("RATING NOT FOUND")
        }else{
            return res.status(200).json(data)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

})


module.exports = routes