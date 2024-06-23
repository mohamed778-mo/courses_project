const ExamAnswer = require("../models/answer_student_model")



const save_answer = async (req, res) => {
    const { studentId, examId, questionId, answer } = req.body;
  
    try {
      const existingAnswer = await ExamAnswer.findOne({ student: studentId, examId, questionId });
  
      if (existingAnswer) {
        existingAnswer.answer = answer;
        existingAnswer.timestamp = new Date();
        await existingAnswer.save();
      } else {
        const newAnswer = new ExamAnswer({
          student: studentId,
          examId,
          questionId,
          answer
        });
        await newAnswer.save();
      }
      
      res.status(200).json({ message: 'Answer saved successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error saving answer', error });
    }
  }
  
  // استرجاع الإجابات
//   app.get('/get-answers/:studentId/:examId',

 const get_answer =  async (req, res) => {
    const { studentId, examId } = req.params;
  
    try {
      const answers = await ExamAnswer.find({ student: studentId, examId }).populate('student');
      res.status(200).json(answers);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving answers', error });
    }
  }
  
  // إنهاء الامتحان
const finish = async (req, res) => {
    const { studentId, examId } = req.body;
  
    try {
      const answers = await ExamAnswer.find({ student: studentId, examId });
  
      // يمكنك هنا تنفيذ أي منطق إضافي لإنهاء الامتحان، مثل حساب النتيجة النهائية أو تحديث حالة الامتحان
  
      res.status(200).json({ message: 'Exam finished successfully', answers });
    } catch (error) {
      res.status(500).json({ message: 'Error finishing exam', error });
    }
  }


  module.exports={
    save_answer,
    get_answer,
    finish
  }
  