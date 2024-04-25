const mongoose = require('mongoose')

var resultSchema = new mongoose.Schema({
    student_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    },
    student_name:{
        type:String
    },
    result:{
        type:Number,
    },
    course:{
        type:String,
       
    },
    course_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses"
    },
    exam_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Exam"
    }
    
  
});


module.exports = mongoose.model('Result', resultSchema);