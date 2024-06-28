const express = require("express")
const router = express.Router()

const {createExam,deleteQuestion,getExam, deleteExam, getquestions,getAllResultsTeacher,getAllExams,getAllResultsExamTeacher ,results_avaliable  }=require("../controllers/exam_control") 

const {adminAuth}=require("../middleware/auth")
const storage = require("../middleware/multer_upload")

/**
 * @swagger
 * tags:
 *   name: Exams
 */

router.post('/add_exam/:course_id', adminAuth, storage.any(), createExam);
router.delete('/delete_question/:exam_id/:question_id',adminAuth,deleteQuestion)
router.delete('/delete_exam/:exam_id',adminAuth,deleteExam)
router.get('/get_questions/:exam_id',adminAuth,getquestions)
router.get('/get_exam/:id',adminAuth,getExam)
router.get('/get_allexams',adminAuth,getAllExams)
router.get('/exam_results/:exam_id',adminAuth,getAllResultsExamTeacher)
router.get('/allresults',adminAuth,getAllResultsTeacher)
router.patch('/results_available/:exam_id',results_avaliable)




module.exports = router
