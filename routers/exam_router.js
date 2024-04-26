const router=require("express").Router()
const {createExam,addQuestion,deleteQuestion,getExam, deleteExam,getExamForStudent, getquestions,sumbit,getAllResultsStudent,getAllResultsTeacher,getAllExams,getAllResultsExamTeacher ,getEXAMStudent}=require("../controllers/exam_control") 
const {adminAuth,auth}=require("../middleware/auth")
const storage = require("../middleware/multer_upload")

router.post('/addexam',adminAuth,createExam)
router.put('/addquestion/:exam_id',adminAuth,storage.single('file'),addQuestion)
router.delete('/deletequestion/:exam_id/:question_id',adminAuth,deleteQuestion)
router.delete('/deleteexam/:exam_id',adminAuth,deleteExam)
router.get('/getquestions/:exam_id',adminAuth,getquestions)
router.get('/getexam/:id',adminAuth,getExam)
router.get('/getallexams',adminAuth,getAllExams)
router.get('/exam_results/:exam_id',adminAuth,getAllResultsExamTeacher)
router.get('/allresults',adminAuth,getAllResultsTeacher)

router.get('/getexamstudent/:id',auth,getEXAMStudent)
router.get('/getquiznow/:id',auth,getExamForStudent)
router.post('/sumbit/:course_id/:exam_id',auth,sumbit)
router.get('/myresults',auth,getAllResultsStudent)
router.get('/exam_my_result',auth,getAllResultsStudent)




module.exports = router
