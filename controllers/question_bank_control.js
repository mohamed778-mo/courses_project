const Question = require('../models/questions_bank_model');  

const add_question = async (req, res) => {
  try {
    const { question, answer_1, answer_2, answer_3, answer_4, mark, role, correctBoolean, correctChoice ,year ,lec} = req.body;

 
    const img = req.file ? `http://https://courses-project-iu0w.onrender.com/uploads/${req.file.filename}` : 'empty';

    const newQuestion = new Question({
      question,
      img,
      answer_1,
      answer_2,
      answer_3,
      answer_4,
      mark,
      role,
      correctBoolean,
      correctChoice,
      year,
      lec
    });
   await newQuestion.save()
    res.status(200).send(newQuestion);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

const get_Questions= async (req, res) => {
    try {
      const questions = await Question.find();
      res.status(200).send(questions);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }


const delete_question = async (req, res) => {
    try {
      const questionId = req.params.id;
      const deletedQuestion = await Question.findByIdAndDelete(questionId);
  
      if (!deletedQuestion) {
        return res.status(404).send("Question not found");
      }
  
      res.status(200).send({ message: "Question deleted successfully" });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
  
 
const edit_question = async (req, res) => {
    try {
      const questionId = req.params.id;
      const { question, answer_1, answer_2, answer_3, answer_4, mark, role, correctBoolean, correctChoice } = req.body;
  
      const img = req.file ? `http://https://courses-project-iu0w.onrender.com/uploads/${req.file.filename}` : undefined;
  
      const updateData = {
        question,
        answer_1,
        answer_2,
        answer_3,
        answer_4,
        mark,
        role,
        correctBoolean,
        correctChoice,
      };
  
     
      if (img) {
        updateData.img = img;
      }
  
      const updatedQuestion = await Question.findByIdAndUpdate(questionId, updateData, { new: true });
  
      if (!updatedQuestion) {
        return res.status(404).send("Question not found");
      }
  
      res.status(200).send(updatedQuestion);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
  

  

  


module.exports = {
    add_question,
    get_Questions,
    delete_question,
    edit_question
};
