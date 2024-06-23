const express = require("express")
const router = express.Router()

const {createExam,deleteQuestion,getExam, deleteExam, getquestions,sumbit,getAllResultsTeacher,getAllExams,getAllResultsExamTeacher ,getAllResultsExamStudent,getQUIZ,getEXAMSFORStudent,results_avaliable, get_My_Answer  }=require("../controllers/exam_control") 

const {adminAuth,auth}=require("../middleware/auth")
const storage = require("../middleware/multer_upload")

router.post('/add_exam/:course_id',adminAuth,storage.single('file'),createExam)
router.delete('/delete_question/:exam_id/:question_id',adminAuth,deleteQuestion)
router.delete('/delete_exam/:exam_id',adminAuth,deleteExam)
router.get('/get_questions/:exam_id',adminAuth,getquestions)
router.get('/get_exam/:id',adminAuth,getExam)
router.get('/get_allexams',adminAuth,getAllExams)

router.get('/exam_results/:exam_id',adminAuth,getAllResultsExamTeacher)
router.get('/allresults',adminAuth,getAllResultsTeacher)
router.patch('/results_available/:exam_id',results_avaliable)

router.get('/get_exam_student/:id',auth,getEXAMSFORStudent)
router.get('/get_quiz_now_for_student/:id',auth,getQUIZ)
router.post('/sumbit/:course_id',auth,sumbit)
router.get('/student_exam_result/:course_id/:exam_id',auth,getAllResultsExamStudent)
router.get('/student_answers/:exam_id', auth, get_My_Answer)
 

module.exports = router