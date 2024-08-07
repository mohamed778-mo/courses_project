const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  img: {
    type: String,
  
  },
  answer_1: {
    type: String,
   
  },
  answer_2: {
    type: String,
   
  },
  answer_3: {
    type: String
  },
  answer_4: {
    type: String
  },
  mark: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    enum: ['choice', 'boolean'],
    required: true
  },
  correctChoice: {
    type: String,
  
  },
  correctBoolean: {
    type: String,
    
  }
,
  year: {
    type: String,
  enum:['one','two','three'],
    required: true
  },

lec:{
    type: String,
},
 teacher_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
}, 

});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
