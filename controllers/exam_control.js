const mongoose = require("mongoose");
const Courses = require("../models/courses_model");
const Student = require("../models/student_model");
const Teacher = require("../models/teacher_model");
const Exam = require("../models/exam_model");
const Result = require("../models/results_model");

const createExam = async (req, res) => {
  try {
    const T_id = req.user._id;
    if (!T_id) {
      return res.status(404).send("please login!!");
    }

    const newExam = new Exam({
      title: req.body.title,
      subject: req.body.subject,
      level: req.body.level,
      departement: req.body.departement,
      total_mark: req.body.total_mark,
      Teacher_Name: req.user.FirstName+' '+req.user.LastName,
      Teacher_Id: req.user._id,
      start: req.body.start,
      end: req.body.end,
    });
    newExam.save();
    res.status(200).send(newExam);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const addQuestion = async (req, res) => {
  try {
    const exam_id = req.params.exam_id
    const data = await Exam.findById(exam_id);
    if(req.file){
      const name = req.file.filename
      
      data.Questions.push({
        question: req.body.question,
        img:`http://https://courses-project-iu0w.onrender.com/uploads/${name}`,
        answer_1: req.body.answer_1,
        answer_2: req.body.answer_2,
        answer_3: req.body.answer_3,
        answer_4: req.body.answer_4,
        mark: req.body.mark,
        role: req.body.role,
        correctBolean: req.body.correctBolean,
        correctChoice: req.body.correctChoice,
      });

      res.status(200).send(data);
     
        }
  


if(!req.file)
{ 
    data.Questions.push({
      question: req.body.question,
      img:'empty',
      answer_1: req.body.answer_1,
      answer_2: req.body.answer_2,
      answer_3: req.body.answer_3,
      answer_4: req.body.answer_4,
      mark: req.body.mark,
      role: req.body.role,
      correctBolean: req.body.correctBolean,
      correctChoice: req.body.correctChoice,
    });

   res.status(200).send(data); 
}
    data.save();
    
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const exam_id = req.params.exam_id;
    const question_id = req.params.question_id;

    await Exam.updateOne(
      { _id: exam_id },
      { $pull: { Questions: { _id: question_id } } }
    );

    res.status(200).send(" deleted !!");
  } catch (e) {
    res.status(500).send(e.message);
  }
};
const getExam = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const check = await Exam.findById(_id);

    if (!check) {
      return res.status(404).send("not found !!");
    }

    const data = await Exam.findById(_id);

    res.status(200).send(data);
  } catch (e) {
    res.status(500).send("something is wrong !!");
  }
};
const getAllExams = async (req, res) => {
  try {
    const teacherId = req.user._id;
    console.log(teacherId);
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).send(" ID is not correct!");
    }

  
    const data = await Exam.find({ Teacher_Id: teacherId });
    console.log(data);

    res.status(200).send(data);
  } catch (e) {
    res.status(500).send("something is wrong !!");
  }
};
const deleteExam = async (req, res) => {
  try {
    const exam_id = req.params.exam_id;
    const check = await Exam.findById(exam_id);

    if (!check) {
      return res.status(404).send("not found !!");
    }

    await Exam.findByIdAndDelete(exam_id);

    res.status(200).send(" EXAM is deleted !!");
  } catch (e) {
    res.status(500).send("something is wrong !!");
  }
};

const getquestions = async (req, res) => {
  const teacher_ID = req.user._id;
  if (!teacher_ID) {
    res.status(404).send("please signup ");
  }
  const Exam_id = req.parems.exam_id;
  const data = await Exam.findById(Exam_id);
  res
    .status(200)
    .send(`Subject : ${data.subject} and Questions: ` + data.Questions);
};


const getExamForStudent=async(req,res,next)=>{
  try{
      const student_ID = req.user._id
      if(!mongoose.Types.ObjectId.isValid(student_ID)){
          return res.status(404).send('your ID is not correct!!')
      }   
      
      const dataresultforstudent = await Result.findOne({student_Id:student_ID})
            if(dataresultforstudent){
              return res.status(400).send(" don't try to palaver ,you use this exam ! ")
            }
    
      const {id:_id} =req.params
      
      const nowUTC = new Date();
  
      const Milliseconds = 2 * 60 * 60 * 1000
      const nowInEgypt = new Date(nowUTC.getTime() + Milliseconds)
  
    
      const quiz = await Exam.findById(_id)
      if(!quiz){
         return  res.status(404).send("not found !!")
         }      
        const quizS= new Date(quiz.start)
  
        const quizStart= new Date(quizS.getTime() + Milliseconds)
  
  
        const quizE= new Date(quiz.end)
        const quizEnd= new Date(quizE.getTime() + Milliseconds)
  
  
      
      if ( nowInEgypt>=quizStart&&nowInEgypt<=quizEnd) {
          req.quiz = quiz
          next()
      }else{
          return res.status(403).send('لا يوجد كويز متاح حاليًا!');
      }
      
      res.status(200).send({Questions:quiz.Questions ,start:quiz.start,end:quiz.end})
        
          }catch(e){res.status(500).send(e.message)}
}

const sumbit =async(req,res)=>{
try{
  const student_ID = req.user._id
  if(!student_ID){
    res.status(404).send("please signup ")
}
  const exam_id =req.params.exam_id
  const course_id = req.params.course_id
  const courseDATA=await Courses.findById(course_id)
  const student_mark = req.body.student_mark
  const data = await Student.findById(student_ID)
  const newResult= new Result({student_Id:student_ID,student_name:data.FirstName+data.LastName , result:student_mark , course:courseDATA.subject , course_Id:course_id , exam_Id:exam_id})
  await newResult.save()
  res.json(newResult.result)
  }catch(e){
  res.status(500).send(e.message)
        }
 }

const getAllResultsTeacher = async (req, res) => {
  const course_id = req.body.course_id;
  const results = await Result.find({ course_Id: course_id });
  res.status(200).send(results);
};
const getAllResultsExamTeacher = async (req, res) => {
  const exam_id = req.params.exam_id;
  const results = await Result.find({ exam_Id: exam_id });
  res.status(200).send(results);
};

const getAllResultsStudent = async (req, res) => {
  const student_ID = req.user._id;
  const course_id = req.body.course_id;
  const results = await Result.find({
    student_Id: student_ID,
    course_Id: course_id,
  });
  res.status(200).send(results);
};

const getAllResultsExamStudent = async (req, res) => {
  const student_ID = req.user._id;
  const exam_id = req.body.exam_id;
  const results = await Result.find({
    student_Id: student_ID,
    exam_Id: exam_id,
  });
  res.status(200).send(results);
};


const getEXAMStudent=async(req,res)=>{
try {
   const course_id=req.params._id
   const dataCourse=await Courses.findById(course_id)
   if(!dataCourse){
    return res.status(404).send("something wrong !!")
  }
   const allData = await Exam.findOne({
        subject: dataCourse.subject,
        level: dataCourse.level,
        departement: dataCourse.departement,
        Teacher_Id: dataCourse.Teacher,
      });
      if(!allData){
        return res.status(404).send("لا يوجد امتحان")
      }
    const title=allData.title
    const total_mark=allData.total_mark
    const Teacher_Name=allData.Teacher_Name
      res.status(200).json({title:`${title}`,total_mark:`${total_mark}`,Teacher_Name:`${Teacher_Name}`,exam_id:`${allData._id}`});
    } catch (e) {
      res.status(500).send(e.message);
    }
  };


module.exports = {
  createExam,
  addQuestion,
  deleteQuestion,
  getExam,
  deleteExam,
  getquestions,
  sumbit,
  getAllResultsTeacher,
  getAllResultsStudent,
  getAllResultsExamStudent,
  getAllResultsExamTeacher,
  getAllExams,
  getExamForStudent,
  getEXAMStudent,

};
