const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  img: {
    type: String,
    default: 'empty'
  },
  answer_1: {
    type: String,
    required: true
  },
  answer_2: {
    type: String,
    required: true
  },
  answer_3: {
    type: String,
    required: true
  },
  answer_4: {
    type: String,
    required: true
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
    required: function() { return this.role === 'choice'; }
  },
  correctBoolean: {
    type: String,
    required: function() { return this.role === 'boolean'; }
  }
,
  year: {
    type: String,
  enum:['one-p','two-p','three-p','one-s','two-s','three-s'],
    required: true
  },

lec:{
    type: String,
}

});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
