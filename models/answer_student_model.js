const mongoose = require('mongoose')

const examAnswerSchema = new mongoose.Schema({
    student:
     { 
        type: String, 
        },
    student_Id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Student"
        },
    examId: { 
        type:mongoose.Schema.Types.ObjectId,
            ref:"Exam"
     },

     Answers:[{
        question_id: {
            type: String, 
            required: true 
           },
       answer: { 
           type:String, 
           required: true 
       }, 
     }]
   ,
    timestamp: {
         type: Date,
         default: Date.now 
        }
  });


module.exports = mongoose.model('ExamAnswer', examAnswerSchema);