const express = require("express")
const router = express.Router()

const {getStudentCourses,buycourse,getpaidcourses}=require("../controllers/courses_control")
const {adminAuth,auth }=require("../middleware/auth")

 
router.get('/getstudentcourses',auth,getStudentCourses)
router.post('/buycourse/:id',auth,buycourse)
router.get('/getpaidcourses',auth,getpaidcourses)



module.exports = router