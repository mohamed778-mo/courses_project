const express = require("express")
const router = express.Router()

const {createExam,single_create_exam,deleteQuestion,getExam, deleteExam, getquestions,getAllResultsTeacher,getAllExams,getAllResultsExamTeacher ,results_avaliable ,results_unavaliable }=require("../controllers/exam_control") 

const {adminAuth}=require("../middleware/auth")
const storage = require("../middleware/multer_upload")



router.post('/add_exam/:course_id', adminAuth, storage.any(), createExam);
router.post('/single_exam/:course_id', adminAuth, storage.any(), single_create_exam);
router.delete('/delete_question/:exam_id/:question_id',adminAuth,deleteQuestion)
router.delete('/delete_exam/:exam_id',adminAuth,deleteExam)
router.get('/get_questions/:exam_id',adminAuth,getquestions)
router.get('/get_exam/:exam_id',adminAuth,getExam)
router.get('/get_allexams',adminAuth,getAllExams)
router.get('/exam_results/:exam_id',adminAuth,getAllResultsExamTeacher)
router.get('/allresults',adminAuth,getAllResultsTeacher)
router.patch('/results_available/:exam_id',results_avaliable)
router.patch('/results_unavailable/:exam_id',results_unavaliable)


module.exports = router
