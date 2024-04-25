const mongoose = require('mongoose'); 

var blogSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
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

module.exports = mongoose.model('Blogs', blogSchema);