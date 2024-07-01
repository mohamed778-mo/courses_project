const mongoose = require('mongoose');

var videoSchema = new mongoose.Schema({
    name:{
        type:String,
       
    },
    videoURL:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    Teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Teacher"
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses"
    },
    TeacherName:{  
        type:String
    },
    CourseName:{  
        type:String
    },
    type:{
        type:String,
        required:true,
        enum:["free","paid"],
       
    },

    codes: {
        type: [String],
        default: []
      },
    usedCodes:{
         type: [String],
        default: []
    }

},
{
    timestamps:true
}



);

module.exports = mongoose.model('Video', videoSchema);
