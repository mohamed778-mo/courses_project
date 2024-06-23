const express = require("express")
const router = express.Router()

const {createCourse,getDetailsCourse,getCourse,getMyCourses,editData,deleteOneData,deleteAllData,getStudentCourses,buycourse,getpaidcourses,deleteCourseThatinStudent,createCode,getCodes,getusedCodes}=require("../controllers/courses_control")
const {adminAuth,auth }=require("../middleware/auth")

router.post('/createcourse',adminAuth,createCourse)
router.get('/getcourse/:id',adminAuth,getCourse)
router.get('/getDetailsCourse/:id',adminAuth,getDetailsCourse)
router.get('/getmycourses',adminAuth,getMyCourses)
router.patch('/editcourse/:id',adminAuth,editData)
router.delete('/deleteallcourse',deleteAllData)
router.delete('/deletecourse/:id',deleteOneData)
router.post('/deletecourseinstudent',deleteCourseThatinStudent)
router.put('/createcode/:course_id',createCode)
router.get('/getcodes/:course_id',adminAuth,getCodes)
router.get('/getusedcodes/:course_id',adminAuth,getusedCodes)


 
router.get('/getstudentcourses',auth,getStudentCourses)
router.post('/buycourse/:id',auth,buycourse)
router.get('/getpaidcourses',auth,getpaidcourses)













module.exports = router