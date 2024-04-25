const mongoose = require('mongoose'); 

var blogSchema_3 = new mongoose.Schema({
    title:{
        type:String,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses",
        required:true
    },
    image:{
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

module.exports = mongoose.model('Blogs_3', blogSchema_3);