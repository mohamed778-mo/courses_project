const express = require("express")
const router = express.Router()

const {sumbit ,getAllResultsExamStudent,getQUIZ,getEXAMSFORStudent, get_My_Answer  }=require("../controllers/exam_control") 

const {auth}=require("../middleware/auth")




router.get('/get_exam_student/:id',auth,getEXAMSFORStudent)
router.get('/get_quiz_now_for_student/:id',auth,getQUIZ)
router.post('/sumbit/:course_id',auth,sumbit)
router.get('/student_exam_result/:course_id/:exam_id',auth,getAllResultsExamStudent)
router.get('/student_answers/:exam_id', auth, get_My_Answer)
 

module.exports = router