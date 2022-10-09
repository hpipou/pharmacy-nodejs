const express = require("express")
const routes = express.Router()
const models = require("../models")
const jwt = require("jsonwebtoken")
const authentication = require("../middleware/authentication")
const multer = require("../middleware/multer")
const multuerErrorCapture = require("../middleware/multerErrorCapture")

///////////////////////////////////////////////////////
// add new profil
///////////////////////////////////////////////////////
routes.post("", authentication, (req,res)=>{

    const fname = req.body.fname
    const lname = req.body.lname
    const phone = req.body.phone
    const adresse = req.body.adresse
    const country = req.body.country 

    if(fname==undefined || fname==null){return res.status(403).json("FIRST NAME UNDEFINED")}
    if(lname==undefined || lname==null){return res.status(403).json("LAST NAME UNDEFINED")}
    if(phone==undefined || phone==null){return res.status(403).json("PHONE NUMBER UNDEFINED")}
    if(adresse==undefined || adresse==null){return res.status(403).json("ADRESSE UNDEFINED")}
    if(country==undefined || country==null){return res.status(403).json("COUNTRY UNDEFINED")}

    if(!fname.match('^[a-zA-Zé]{3,15}$')){return res.status(403).json("FIRST NAME INCORRECT")}
    if(!lname.match('^[a-zA-Zé]{3,15}$')){return res.status(403).json("LAST NAME INCORRECT")}
    if(!phone.match('^[0-9 ]{7,15}$')){return res.status(403).json("PHONE NUMBER INCORRECT")}
    if(!adresse.match('^[a-zA-Z0-9 ,.é]{3,50}$')){return res.status(403).json("ADRESSE INCORRECT")}
    if(!country.match('^[a-zA-Zé]{3,15}$')){return res.status(403).json("COUNTRY INCORRECT")}

    const token= req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const idUser = tokenDecoded.id

    // check if profil existe
    models.Profil.findOne({attributes:['id'], where:{idUser:idUser}})
    .then((data)=>{
        if(data==null){
            addProfil()
        }else{
            return res.status(403).json("PROFIL ALREADY EXIST")
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // create profil
    function addProfil(){
        models.Profil.create({
                    fname : fname,
                    lname : lname,
                    imgURL : 'standard.jpg',
                    phone : phone,
                    adresse : adresse,
                    country : country,
                    idUser: idUser
        })
        .then(()=>{return res.status(201).json("GREAT! PROFIL CREATED") })
        .catch((error)=>{return res.status(500).json(error)})
    }

})

///////////////////////////////////////////////////////
// edit profil
///////////////////////////////////////////////////////
routes.put("", authentication, (req,res)=>{

    const fname = req.body.fname
    const lname = req.body.lname
    const phone = req.body.phone
    const adresse = req.body.adresse
    const country = req.body.country 

    if(fname==undefined || fname==null){return res.status(403).json("FIRST NAME UNDEFINED")}
    if(lname==undefined || lname==null){return res.status(403).json("LAST NAME UNDEFINED")}
    if(phone==undefined || phone==null){return res.status(403).json("PHONE NUMBER UNDEFINED")}
    if(adresse==undefined || adresse==null){return res.status(403).json("ADRESSE UNDEFINED")}
    if(country==undefined || country==null){return res.status(403).json("COUNTRY UNDEFINED")}

    if(!fname.match('^[a-zA-Zé]{3,15}$')){return res.status(403).json("FIRST NAME INCORRECT")}
    if(!lname.match('^[a-zA-Zé]{3,15}$')){return res.status(403).json("LAST NAME INCORRECT")}
    if(!phone.match('^[0-9 ]{7,15}$')){return res.status(403).json("PHONE NUMBER INCORRECT")}
    if(!adresse.match('^[a-zA-Z0-9 ,.é]{3,50}$')){return res.status(403).json("ADRESSE INCORRECT")}
    if(!country.match('^[a-zA-Zé]{3,15}$')){return res.status(403).json("COUNTRY INCORRECT")}

    const token= req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const idUser = tokenDecoded.id

    // check if profil existe
    models.Profil.findOne({attributes:['id'], where:{idUser:idUser}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("PROFIL NOT FOUND")
        }else{
            editProfil()
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // create profil
    function editProfil(){
        models.Profil.update({
                    fname : fname,
                    lname : lname,
                    phone : phone,
                    adresse : adresse,
                    country : country
        }, {where:{idUser:idUser}})
        .then(()=>{return res.status(201).json("GREAT! PROFIL UPDATED") })
        .catch((error)=>{return res.status(500).json(error)})
    }

})


///////////////////////////////////////////////////////
// UPLOAD PROIL PICTURE
///////////////////////////////////////////////////////
routes.put("/picture", authentication, multer.single('file'), multuerErrorCapture, (req,res)=>{

    if(req.file==null || req.file==undefined){return res.status(403).json("IMAGE UNDEFINED")}

    const token= req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const idUser = tokenDecoded.id

    // check if profil existe
    models.Profil.findOne({attributes:['id'], where:{idUser:idUser}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("PROFIL NOT FOUND")
        }else{
            editProfil()
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // create profil
    function editProfil(){
        models.Profil.update({ imgURL:req.file.filename }, {where:{idUser:idUser}})
        .then(()=>{return res.status(201).json("GREAT! PICTURE UPDATED") })
        .catch((error)=>{return res.status(500).json(error)})
    }

})

///////////////////////////////////////////////////////
// show one profil
///////////////////////////////////////////////////////
routes.get("/:id",(req,res)=>{

    const idProfil = req.params.id

    if(idProfil==undefined || idProfil==null){return res.status(403).json("PROFIL ID UNDEFINED")}

    if(!idProfil.match('^[0-9]{1,10}$')){return res.status(403).json("PROFIL ID INCORRECT")}

    // check if profil existe
    models.Profil.findOne({attributes:['id','fname','lname','phone','adresse','country','imgURL'], where:{id:idProfil}, include:{model:models.User, attributes:['id','email','username','status','roleName']}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("PROFIL NOT FOUND")
        }else{
            return res.status(200).json(data)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

})

///////////////////////////////////////////////////////
// show all profils
///////////////////////////////////////////////////////
routes.get("",(req,res)=>{
    
    models.Profil.findAll({attributes:['id','fname','lname','phone','adresse','country','imgURL'], include:{model:models.User, attributes:['id','email','username','status','roleName']}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("PROFIL NOT FOUND")
        }else{
            return res.status(200).json(data)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})
})




module.exports = routes