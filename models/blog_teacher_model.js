const mongoose = require('mongoose'); 

var blogSchema_2 = new mongoose.Schema({
    title:{
        type:String,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Teacher",
        required:true
    },
    image:{
        type:String,
        required:true,
        trim:true,
        
    },
    video:{
        type:String,
        required:true,
        trim:true,
    }
}
,
{
    timestamps:true
}
);

module.exports = mongoose.model('Blogs_2', blogSchema_2);