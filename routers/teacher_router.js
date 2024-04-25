const express =require("express")
const router  = express.Router()
const {Register,VerifiyEmail,Login,getUser,getAllUser,accessUser,unAccessUser,deleteCourseThatinStudent,editData,deleteOneData,deleteAllData,blockUser,unBlockUser,changePassword,loginOut,forgetPassword,resetPassword,getAllStudent}=require("../controllers/teacher_control")
const { adminAuth }=require("../middleware/auth")


router.post('/register',Register)
router.get('/verfiy/:id',VerifiyEmail)
router.post('/login',Login)
router.get('/getuser/:id',adminAuth,getUser)
router.get('/getalluser',getAllUser)
router.patch('/editdata/:id',adminAuth,editData)
router.patch('/block/:id',blockUser)
router.patch('/unblock/:id',unBlockUser)
router.patch('/access/:id',accessUser)
router.patch('/unaccess/:id',unAccessUser)
router.delete('/delete/:id',adminAuth,deleteOneData)
router.delete('/deleteallstudent',adminAuth,deleteAllData)
router.patch('/changepassword/:id',adminAuth,changePassword)
router.delete('/loginout',loginOut)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token',resetPassword)
router.get('/getallstudent',adminAuth,getAllStudent)
router.delete('/deletecourseinstudent/:student_id/:course_id',adminAuth,deleteCourseThatinStudent)









module.exports = router;


