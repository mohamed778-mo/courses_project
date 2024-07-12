const express = require("express")
const router = express.Router()

const {sumbit ,getAllResultsExamStudent,getQUIZ,getEXAMSFORStudent, get_My_Answer , get_all_revisions ,get_end_exam  }=require("../controllers/exam_control") 

const {auth}=require("../middleware/auth")




router.get('/get_exam_student/:id',auth,getEXAMSFORStudent)
router.get('/get_quiz_now_for_student/:id',auth,getQUIZ)
router.post('/sumbit/:course_id',auth,sumbit)
router.get('/student_exam_result/:course_id/:exam_id',auth,getAllResultsExamStudent)
router.get('/student_answers/:exam_id', auth, get_My_Answer)

router.get('/get_all_exercise', auth, get_all_revisions)

router.get('/get_ended_exam', auth, get_end_exam)

module.exports = router
