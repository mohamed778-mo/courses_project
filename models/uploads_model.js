const mongoose = require('mongoose'); 


var UploadsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
      
    },
    pdf:{
        type:String
    },
    Teacher_Name:{
        type:String
    }
    ,
    Teacher_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Teacher"
    } ,
     Course_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses"
    },
    Course_Name:{
        type:String

    },
    year: {
        type: String,
      enum:['one-p','two-p','three-p','one-s','two-s','three-s'],
        required: true
      },
    
    lec:{
        type: String,
    }
    
});


module.exports = mongoose.model('Uploads', UploadsSchema);