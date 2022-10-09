const express = require("express")
const routes = express.Router()
const models = require("../models")
const authentication = require("../middleware/authentication")

//////////////////////////////////////////////////////////////
// add new category
//////////////////////////////////////////////////////////////
routes.post("",authentication,(req,res)=>{

    const category_name = req.body.category_name.toUpperCase()

    // check category_name input
    if(category_name==undefined || category_name==null){return res.status(403).json("CATEGORY NAME UNDEFINED")}
    if(!category_name.match('^[a-zA-Z0-9 é]{3,15}$')){return res.status(403).json("CATEGORY NAME INCORRECT")}
 
    // check if category exist
    models.Category.findOne({attributes:['id'], where:{category_name:category_name}})
    .then((data)=>{
        if(data==null){
            addCategory()
        }else{
            return res.status(403).json("CATEGORY ALREADY EXIST")
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // add new category
    function addCategory(){
        models.Category.create({category_name:category_name})
        .then(()=>{return res.status(201).json("GREAT! CATEGORY CREATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
})

//////////////////////////////////////////////////////////////
// edit category
//////////////////////////////////////////////////////////////
routes.put("",authentication,(req,res)=>{

    const category_name = req.body.category_name.toUpperCase()
    const NEWcategory_name = req.body.NEWcategory_name.toUpperCase()

    // check category_name input
    if(category_name==undefined || category_name==null){return res.status(403).json("CATEGORY NAME UNDEFINED")}
    if(!category_name.match('^[a-zA-Z0-9 é]{3,15}$')){return res.status(403).json("CATEGORY NAME INCORRECT")}

    if(NEWcategory_name==undefined || NEWcategory_name==null){return res.status(403).json("NEW CATEGORY NAME UNDEFINED")}
    if(!NEWcategory_name.match('^[a-zA-Z0-9 é]{3,15}$')){return res.status(403).json("NEW CATEGORY NAME INCORRECT")}
 
    // check if category exist
    models.Category.findOne({attributes:['id'], where:{category_name:category_name}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("CATEGORY NOT FOUND")
        }else{
            editCategory()
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // edit category
    function editCategory(){
        models.Category.update({category_name:NEWcategory_name},{where:{category_name:category_name}})
        .then(()=>{return res.status(200).json("GREAT! CATEGORY UPDATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
})

//////////////////////////////////////////////////////////////
// delete category
//////////////////////////////////////////////////////////////
routes.delete("",authentication,(req,res)=>{
    
    const category_name = req.body.category_name.toUpperCase()

    // check category_name input
    if(category_name==undefined || category_name==null){return res.status(403).json("CATEGORY NAME UNDEFINED")}
    if(!category_name.match('^[a-zA-Z0-9 é]{3,15}$')){return res.status(403).json("CATEGORY NAME INCORRECT")}
 
    // check if category exist
    models.Category.findOne({attributes:['id'], where:{category_name:category_name}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("CATEGORY NOT FOUND")
        }else{
            deleteCategory()
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // delete category
    function deleteCategory(){
        models.Category.destroy({where:{category_name:category_name}})
        .then(()=>{return res.status(200).json("GREAT! CATEGORY DELETED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
})

//////////////////////////////////////////////////////////////
// show all categories
//////////////////////////////////////////////////////////////
routes.get("",(req,res)=>{
 
    models.Category.findAll({attributes:['id','category_name']})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("CATEGORY NOT FOUND")
        }else{
            return res.status(200).json(data)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

})


module.exports = routes