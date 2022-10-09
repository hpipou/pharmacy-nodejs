const express = require("express")
const routes = express.Router()
const models = require("../models")
const jwt = require("jsonwebtoken")
const multer = require("../middleware/multer")
const multerErrorCapture = require("../middleware/multerErrorCapture")
const authentication = require("../middleware/authentication")


////////////////////////////////////////////
// add new product
////////////////////////////////////////////
routes.post("", authentication, multer.single('file'), multerErrorCapture, (req,res)=>{

    const name = req.body.name.toUpperCase()
    const description = req.body.description 
    const category_name = req.body.category_name.toUpperCase() 

    if(req.file==undefined || req.file==null){return res.status(403).json("FILE UNDEFINED")}
    if(name==undefined || name==null){return res.status(403).json("PRODUCT NAME UNDEFINED")}
    if(description==undefined || description==null){return res.status(403).json("PRODUCT DESCRIPTION UNDEFINED")}
    if(category_name==undefined || category_name==null){return res.status(403).json("CATEGORY UNDEFINED")}

    if(!name.match('^[a-zA-Z0-9 é]{3,50}$')){return res.status(403).json("PRODUCT NAME INCORRECT")}
    if(!description.match('^[a-zA-Z0-9 é]{3,150}$')){return res.status(403).json("DESCRIPTION INCORRECT")}
    if(!category_name.match('^[a-zA-Z é]{3,15}$')){return res.status(403).json("CATEGORY NAME INCORRECT")}

    const token= req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const idUser = tokenDecoded.id

    models.Profil.findOne({attributes:['id'], where:{idUser:idUser}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("YOU NEED COMPLET YOUR PROFIL")
        }else{
            checkCategory(data.id)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // check category id
    function checkCategory(myProfil){
        models.Category.findOne({attributes:['id'], where:{category_name:category_name}})
        .then((dataCategory)=>{
            if(dataCategory==null){
                return res.status(403).json("CATEGORY NOT FOUND")
            }else{
                addNewProduct(idUser, myProfil, dataCategory.id)
            }
        })
        .catch((error)=>{return res.status(500).json(error)})
    }

    // add new product
    function addNewProduct(myIdUser,myIdProfil,myIdCategory){
        models.Product.create({
            name : name,
            description : description,
            imgURL : req.file.filename, 
            idUser : myIdUser,
            idProfil: myIdProfil,
            idCategory:myIdCategory
        })
        .then(()=>{return res.status(201).json("GREAT! PRODUCT CREATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})

////////////////////////////////////////////
// edit product
////////////////////////////////////////////
routes.put("/:id", authentication,(req,res)=>{

    const idProduct = req.params.id
    if(idProduct==undefined || idProduct==null){return res.status(403).json("PRODUCT ID UNDEFINED")}
    if(!idProduct.match('^[0-9]{1,10}$')){return res.status(403).json("PRODUCT ID INCORRECT")}

    const name = req.body.name.toUpperCase()
    const description = req.body.description 
    const category_name = req.body.category_name.toUpperCase() 

    if(name==undefined || name==null){return res.status(403).json("PRODUCT NAME UNDEFINED")}
    if(description==undefined || description==null){return res.status(403).json("PRODUCT DESCRIPTION UNDEFINED")}
    if(category_name==undefined || category_name==null){return res.status(403).json("CATEGORY UNDEFINED")}

    if(!name.match('^[a-zA-Z0-9 é]{3,50}$')){return res.status(403).json("PRODUCT NAME INCORRECT")}
    if(!description.match('^[a-zA-Z0-9 é]{3,150}$')){return res.status(403).json("DESCRIPTION INCORRECT")}
    if(!category_name.match('^[a-zA-Z é]{3,15}$')){return res.status(403).json("CATEGORY NAME INCORRECT")}

    const token= req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const idUser = tokenDecoded.id

    models.Product.findOne({attributes:['id','idUser'], where:{id:idProduct}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("PRODUCT NOT FOUND")
        }else{
            if(data.idUser==idUser){
                editProduct()
            }else{
                return res.status(403).json("YOU ARE NOT THE PUBLISHER")
            }
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    
    // edit product
    function editProduct(){
        models.Product.update({
            name : name,
            description : description
        },{where:{id:idProduct}})
        .then(()=>{return res.status(201).json("GREAT! PRODUCT UPDATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})

////////////////////////////////////////////
// edit picture
////////////////////////////////////////////
routes.patch("/picture", authentication, multer.single('file'), multerErrorCapture, (req,res)=>{
    
    const idProduct = req.body.id
    if(idProduct==undefined || idProduct==null){return res.status(403).json("PRODUCT ID UNDEFINED")}
    if(!idProduct.match('^[0-9]{1,10}$')){return res.status(403).json("PRODUCT ID INCORRECT")}

    if(req.file==undefined || req.file==null){return res.status(403).json("FILE UNDEFINED")}
  
    const token= req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const idUser = tokenDecoded.id

    models.Product.findOne({attributes:['id','idUser'], where:{id:idProduct}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("PRODUCT NOT FOUND")
        }else{
            if(data.idUser==idUser){
                editPicture()
            }else{
                return res.status(403).json("YOU ARE NOT THE PUBLISHER")
            }
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // edit picture
    function editPicture(){
        models.Product.update({imgURL : req.file.filename},{where:{id:idProduct}})
        .then(()=>{return res.status(201).json("GREAT! PICTURE UPDATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})


////////////////////////////////////////////
// delete product
////////////////////////////////////////////
routes.delete("/:id",authentication,(req,res)=>{
    
    const idProduct = req.params.id

    if(idProduct==undefined || idProduct==null){return res.status(403).json("PRODUCT ID UNDEFINED")}

    if(!idProduct.match('^[0-9]{1,10}$')){return res.status(403).json("PRODUCT ID INCORRECT")}

    const token= req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const idUser = tokenDecoded.id

    // check if product existe
    models.Product.findOne({attributes:['id','idUser'], where:{id:idProduct}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("PRODUCT NOT FOUND")
        }else{
            if(data.idUser==idUser){
                deleteProduct()
            }else{
                return res.status(403).json("YOU ARE NOT THE PUBLISHER")
            }
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // delete product
    function deleteProduct(){
        models.Product.destroy({where:{id:idProduct}})
        .then(()=>{return res.status(200).json("GREAT! PRODUCT REMOVED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
})

////////////////////////////////////////////
// show one product
////////////////////////////////////////////
routes.get("/:id",(req,res)=>{

    const idProduct = req.params.id

    if(idProduct==undefined || idProduct==null){return res.status(403).json("PRODUCT ID UNDEFINED")}

    if(!idProduct.match('^[0-9]{1,10}$')){return res.status(403).json("PRODUCT ID INCORRECT")}

    // check if product existe
    models.Product.findOne({
        attributes:['id','name','description','imgURL','idUser','idProfil','idCategory'], 
        where:{id:idProduct}, 
        include:[{model:models.User, attributes:['id','email','username','status','roleName']},
                 {model:models.Profil, attributes:['id','fname','lname','imgURL']},
                 {model:models.Category, attributes:['id','category_name']}
                ]
    })
    .then((data)=>{
        if(data==null){
            return res.status(403).json("PRODUCT NOT FOUND")
        }else{
            return res.status(200).json(data)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})
})

////////////////////////////////////////////
// show all products
////////////////////////////////////////////
routes.get("",(req,res)=>{

    models.Product.findAll({
        attributes:['id','name','description','imgURL'], 
        include:[{model:models.User, attributes:['id','email','username','status','roleName']},
                 {model:models.Profil, attributes:['id','fname','lname','imgURL']},
                 {model:models.Category, attributes:['id','category_name']}
        ]
    })
    .then((data)=>{
        if(data.length<1){
            return res.status(403).json("PRODUCT NOT FOUND")
        }else{
            return res.status(200).json(data)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})
})


module.exports = routes