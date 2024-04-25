const mongoose = require("mongoose")
require("dotenv").config()


const ATLAS_URL= process.env.ATLAS_URL
const DBconnection =()=>{ 
mongoose.connect(ATLAS_URL)
.then(()=>{console.log('done connection !!')})
.catch((e)=>{console.log(e.message)})
}


module.exports= DBconnection;

