const mongoose = require('mongoose');

var videoSchema = new mongoose.Schema({
    name:{
        type:String,
       
    },
    videoURL:{
        type:String,
    },
    description:{
        type:String
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