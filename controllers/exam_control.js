const mongoose = require("mongoose");
const Courses = require("../models/courses_model");
const Student = require("../models/student_model");
const Exam = require("../models/exam_model");
const Result = require("../models/results_model");
const ExamAnswer = require("../models/answer_student_model")
const Question = require("../models/questions_bank_model")
const admin = require('firebase-admin');
const fs = require('fs');
require('dotenv').config();


const serviceAccount =JSON.parse(process.env.SERVER)



const createExam = async (req, res) => {
  try {
    const T_id = req.user._id;
    if (!T_id) {
      return res.status(404).send("Please login!!");
    }

    const course_id = req.params.course_id;

    const newExam = new Exam({
      title: req.body.title,
      subject: req.body.subject,
      level: req.body.level,
      department: req.body.department,
      Teacher_Name: `${req.user.FirstName} ${req.user.LastName}`,
      Teacher_Id: req.user._id,
      start: req.body.start,
      end: req.body.end,
      Course_Id: course_id
    });
console.log(req.body.start)
    await newExam.save();

    const exam_id = newExam._id;
    const data = await Exam.findById(exam_id);

    const questions = JSON.parse(req.body.questions);

    if (Array.isArray(questions) && questions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        const Question = questions[i];
        let newQuestion;

        const file = req.files ? req.files.find(f => f.fieldname === `questions[${i}].imgFile`) : undefined;
        
        if (file) {
          if (!admin.apps.length) {
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
              storageBucket: process.env.STORAGE_BUCKET
            });
          }

          const bucket = admin.storage().bucket();
          const blob = bucket.file(file.filename);
          const blobStream = blob.createWriteStream({
            metadata: {
              contentType: file.mimetype
            }
          });

          await new Promise((resolve, reject) => {
            blobStream.on('error', (err) => {
              reject(err);
            });

            blobStream.on('finish', async () => {
              try {
                await blob.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                fs.unlinkSync(file.path);
                newQuestion = {
                  question: Question.question,
                  img: publicUrl,
                  answer_1: Question.answer_1,
                  answer_2: Question.answer_2,
                  answer_3: Question.answer_3,
                  answer_4: Question.answer_4,
                  mark: Question.mark,
                  role: Question.role,
                  correctBoolean: Question.correctBoolean,
                  correctChoice: Question.correctChoice,
                };
                data.Questions.push(newQuestion);
                resolve();
              } catch (err) {
                reject(err);
              }
            });

            fs.createReadStream(file.path).pipe(blobStream);
          });
        } else {
          newQuestion = {
            question: Question.question,
            img: 'empty',
            answer_1: Question.answer_1,
            answer_2: Question.answer_2,
            answer_3: Question.answer_3,
            answer_4: Question.answer_4,
            mark: Question.mark,
            role: Question.role,
            correctBoolean: Question.correctBoolean,
            correctChoice: Question.correctChoice,
          };
          data.Questions.push(newQuestion);
        }
      }
    }
    
    const selected_ids = JSON.parse(req.body.selected_ids)
   
    if(Array.isArray(selected_ids) && selected_ids.length > 0 ){

      const selected_questions = await Question.find( { _id :{ $in : selected_ids } } )
      
      selected_questions.forEach( (q)=>{

      let new_Question_Selected = {
          question: q.question,
          img: q.img,
          answer_1: q.answer_1,
          answer_2: q.answer_2,
          answer_3: q.answer_3,
          answer_4: q.answer_4,
          mark: q.mark,
          role: q.role,
          correctBoolean: q.correctBoolean,
          correctChoice: q.correctChoice,
        };
        data.Questions.push(new_Question_Selected);

        
      })
      
    }

    

    await data.save();
    res.status(200).send({ exam: newExam, questions: data.Questions });

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
    const exam_id = req.params.exam_id
    const data = await Exam.findById(exam_id);

    if (!data) {
      return res.status(404).send("not found !!");
    }

    res.status(200).send(data);
  } catch (e) {
    res.status(500).send("something is wrong !!");
  }
};

const getAllExams = async (req, res) => {
  try {
    const teacherId = req.user._id;

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


const getQUIZ=async(req,res)=>{
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
  
      const Milliseconds = 3 * 60 * 60 * 1000
      const nowInEgypt = new Date(nowUTC.getTime() + Milliseconds)
 
    
      const quiz = await Exam.findById(_id)
      if(!quiz){
         return  res.status(404).send("not found !!")
         }      
        const quizS= new Date(quiz.start)
  
        const quizStart= new Date(quizS.getTime()+Milliseconds)
  
  
        const quizE= new Date(quiz.end)

        const quizEnd= new Date(quizE.getTime()+Milliseconds)
  
 
      
      if ( nowInEgypt>=quizStart&&nowInEgypt<=quizEnd) {
          req.quiz = quiz
          return res.status(200).json({Questions:quiz.Questions ,start:quiz.start,end:quiz.end}) 
      }else{
          return res.status(403).send(' there is no quiz now !');
      }
      
     
        
          }catch(e){res.status(500).send(e.message)}
}

const sumbit =async(req,res)=>{
try{
  const student_ID = req.user._id

  if(!student_ID){
    res.status(404).send("please signup ")
}
const data_student=await Student.findById(student_ID)


  const examId = req.body.exam_id
  const answers  = req.body.Answers
    
   
    const existingAnswer = await ExamAnswer.findOne({ student: data_student.FirstName + data_student.LastName, student_Id:student_ID, examId});

    if (existingAnswer) {
      return res.status(403).send(" you finish exam !!")
    }
    else{  
    const data =  new ExamAnswer({
        student: data_student.FirstName + data_student.LastName ,
        student_Id: student_ID ,
        examId: examId
       })
      if (Array.isArray(answers) && answers.length > 0) {
        answers.forEach((ans) => {
          let newAnswer = {
            question_id: ans.question_id,
            answer:ans.answer
          };
          data.Answers.push(newAnswer);
      
        });
       
      }
      
      await data.save()
   } 
    
    console.log({ message: 'Answers saved successfully' });
  

  const course_id = req.params.course_id
  const courseDATA=await Courses.findById(course_id)
  const student_mark = req.body.student_mark ? `${req.body.student_mark}`:'not yet'
  const data = await Student.findById(student_ID)
  const newResult= new Result({student_Id:student_ID,student_name:data.FirstName+data.LastName , result:student_mark , course:courseDATA.subject , course_Id:course_id , exam_Id:examId})
  await newResult.save()
  res.status(200).json('compelete response ,good luck.')
  }catch(e){
  res.status(500).send(e.message)
        }
 }



//Teacher//

const getAllResultsTeacher = async (req, res) => {
  try{
  const course_id = req.body.course_id;
  const results = await Result.find({ course_Id: course_id });
  res.status(200).send(results);
  }catch(e){res.status(500).send(e.message)}

};
const getAllResultsExamTeacher = async (req, res) => {
  try{
  const exam_id = req.params.exam_id;
  const results = await Result.find({ exam_Id: exam_id });
  res.status(200).send(results);
}catch(e){res.status(500).send(e.message)}
  
};

const results_avaliable=async(req,res)=>{
  try{
const exam_id = req.params.exam_id
const edit_value = await Exam.findByIdAndUpdate(exam_id,{results_available:true},{new:true})
res.status(200).send('results are avaliable')


  }catch(e){res.status(500).send(e.message)}
}

const results_unavaliable=async(req,res)=>{
  try{
const exam_id = req.params.exam_id
const edit_value = await Exam.findByIdAndUpdate(exam_id,{results_available:false},{new:true})
res.status(200).send('results are unavaliable')


  }catch(e){res.status(500).send(e.message)}
}

//students//

// const getAllResultsStudent = async (req, res) => {
//   try{ 
//   const student_ID = req.user._id;
//   const course_id = req.params.course_id;
//   const exam_id = req.params. exam_id
  
//   const check_result_aval =await Exam.findById(exam_id)
//   if(check_result_aval.results_available){

//   const results = await Result.find({
//     student_Id: student_ID,
//     course_Id: course_id,
//     exam_Id:exam_id

//   });


//   res.status(200).send(results);
// }
// else{
//   return res.status(400).send("result is not available")
// }

//   }catch(e){res.status(500).send(e.message)}

// };

const getAllResultsExamStudent = async (req, res) => {
  try{ 
    const student_ID = req.user._id;
    const course_id = req.params.course_id;
    const exam_id = req.params.exam_id
    
    const check_result_aval =await Exam.findById(exam_id)
    if(check_result_aval.results_available){
  
    const results = await Result.findOne({
      student_Id: student_ID,
      course_Id: course_id,
      exam_Id:exam_id
  
    });
  
  
    res.status(200).send({result:results.result});
  }
  else{
    return res.status(400).send("result is not available")
  }
  
    }catch(e){res.status(500).send(e.message)}
  
};


const getEXAMSFORStudent=async(req,res)=>{
try {
   const course_id=req.params.id
   const dataCourse=await Courses.findById(course_id)
   if(!dataCourse){
    return res.status(404).send("course not exist !!")
  }
   const allData = await Exam.find({Course_Id:course_id}).select("-Questions");
      if(!allData){
        return res.status(404).send(" exams in this course not available .")
      }
      
      // console.log(await Exam.find({Questions:{$elemMatch:{question:"What"}}}))

    const nowUTC = new Date();
    const Milliseconds = 3 * 60 * 60 * 1000
    const nowInEgypt = new Date(nowUTC.getTime() + Milliseconds)

console.log(nowInEgypt)
    const examsNotStarted = [];
    const examsEnded = [];
    const examsOngoing = [];

    allData.forEach((exam) => {
      const start_D = new Date(exam.start)
      const D_S = new Date(start_D.getTime()+Milliseconds)
    console.log(start_D)
      console.log(start_D.getTime()+Milliseconds)
      console.log(D_S)
    const end_D = new Date(exam.end)
    const D_E = new Date(end_D.getTime()+Milliseconds)

    if (D_S >= nowInEgypt && nowInEgypt <= D_E ) {

        examsNotStarted.push(exam);
      } else if (nowInEgypt >= D_S && nowInEgypt >= D_E ) {
        examsEnded.push(exam);
      } else if (nowInEgypt >= D_S && nowInEgypt <= D_E ) {
        examsOngoing.push(exam);
      }
    });


    res.status(200).json({examsNotStarted:examsNotStarted  , examsEnded:examsEnded ,examsOngoing: examsOngoing,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const get_My_Answer = async(req,res)=>{
try{
  const student_ID = req.user._id;
  const exam_id = req.params.exam_id
 
 const get_my_answer = await ExamAnswer.findOne({ student_Id:student_ID , examId:exam_id})
 
 
 const ans = get_my_answer.Answers

  res.status(200).send({Answers:ans})
}catch(e){
  res.status(500).send(e.message)
}


}
  


const single_create_exam=async(req,res)=>{

  try {
    const T_id = req.user._id;
    if (!T_id) {
      return res.status(404).send("Please login!!");
    }

    
    const newExam = new Exam({
      title: 'exercise',
      subject: req.body.subject,
      level: req.body.level,
      department: req.body.department,
      Teacher_Name: `${req.user.FirstName} ${req.user.LastName}`,
      Teacher_Id: req.user._id,
      start: 'unlimited',
      end: 'unlimited',
      
    });

    await newExam.save();

    const exam_id = newExam._id;
    const data = await Exam.findById(exam_id);

    const questions = JSON.parse(req.body.questions);

    if (Array.isArray(questions) && questions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        const Question = questions[i];
        let newQuestion;

        const file = req.files ? req.files.find(f => f.fieldname === `questions[${i}].imgFile`) : undefined;
        if (file) {
          
          if (!admin.apps.length) {
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
              storageBucket: process.env.STORAGE_BUCKET
            });
          }

          const bucket = admin.storage().bucket();
          const blob = bucket.file(file.filename);
          const blobStream = blob.createWriteStream({
            metadata: {
              contentType: file.mimetype
            }
          });

          await new Promise((resolve, reject) => {
            blobStream.on('error', (err) => {
              reject(err);
            });

            blobStream.on('finish', async () => {
              try {
                await blob.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                fs.unlinkSync(file.path);
                newQuestion = {
                  question: Question.question,
                  img: publicUrl,
                  answer_1: Question.answer_1,
                  answer_2: Question.answer_2,
                  answer_3: Question.answer_3,
                  answer_4: Question.answer_4,
                  mark: Question.mark,
                  role: Question.role,
                  correctBoolean: Question.correctBoolean,
                  correctChoice: Question.correctChoice,
                };
                data.Questions.push(newQuestion);
                resolve();
              } catch (err) {
                reject(err);
              }
            });

            fs.createReadStream(file.path).pipe(blobStream);
          });
       
       
       
        } else {
          newQuestion = {
            question: Question.question,
            img: 'empty',
            answer_1: Question.answer_1,
            answer_2: Question.answer_2,
            answer_3: Question.answer_3,
            answer_4: Question.answer_4,
            mark: Question.mark,
            role: Question.role,
            correctBoolean: Question.correctBoolean,
            correctChoice: Question.correctChoice,
          };
          data.Questions.push(newQuestion);
        }
      }
    }

const selected_ids = JSON.parse(req.body.selected_ids)
   
    if(Array.isArray(selected_ids) && selected_ids.length > 0 ){

      const selected_questions = await Question.find( { _id :{ $in : selected_ids } } )
      
      selected_questions.forEach( (q)=>{

      let new_Question_Selected = {
          question: q.question,
          img: q.img,
          answer_1: q.answer_1,
          answer_2: q.answer_2,
          answer_3: q.answer_3,
          answer_4: q.answer_4,
          mark: q.mark,
          role: q.role,
          correctBoolean: q.correctBoolean,
          correctChoice: q.correctChoice,
        };
        data.Questions.push(new_Question_Selected);

        
      })
      
    }

    

    await data.save();
    res.status(200).send({ exam: newExam, questions: data.Questions });
    await data.save();
    res.status(200).send({ exam: newExam, questions: data.Questions });

  } catch (e) {
    res.status(500).send(e.message);
  }
};


const get_all_revisions=async(req,res)=>{

try{
const subject = req.body.subject
const teacher_id =  req.body.teacher_id

  const data = await Exam.find({ title:'exercise' , subject:subject, Teacher_Id:teacher_id ,  start: 'unlimited',  end: 'unlimited'})


res.status(200).send(data)

  
}catch(e){res.status(500).send(e.message)}


  
}




module.exports = {
  createExam,
  single_create_exam,
  deleteQuestion,
  getExam,
  deleteExam,
  getquestions,
  getAllExams,

  getAllResultsTeacher,
  getAllResultsExamTeacher,
  results_avaliable,
  results_unavaliable,

  getEXAMSFORStudent,
  getQUIZ,
  sumbit,
  getAllResultsExamStudent,
  get_My_Answer,
  
get_all_revisions
};
