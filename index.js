const express = require("express")
const app = express()
const cors = require("cors")
const helmet = require("helmet")

// secure HTTP Headers
app.use(helmet())

// deploy cors & policy
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

// declare routes
const user_Routes = require("./routes/userRoutes")
const profil_Routes = require("./routes/profilRoutes")
const category_Routes = require("./routes/categoryRoutes")
const product_Routes = require("./routes/productRoutes")
const rating_Routes = require("./routes/ratingRoutes")
const comment_Routes = require("./routes/commentRoutes")

// deploy routes
app.use("/users",user_Routes)
app.use("/profils",profil_Routes)
app.use("/categories",category_Routes)
app.use("/products",product_Routes)
app.use("/ratings",rating_Routes)
app.use("/comments",comment_Routes)

// launch server
app.listen(3000, ()=>console.log("SERVER START AT PORT 3000"))