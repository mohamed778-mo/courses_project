const express =require("express")
const router  = express.Router()
const {Register,VerifiyEmail,Login,getUser,getAllUser,editData,changePassword,loginOut,forgetPassword,resetPassword}=require("../controllers/student_control")
const {auth}=require("../middleware/auth")

router.post('/register',Register)
router.get('/verfiy/:id',VerifiyEmail)
router.post('/login',Login)
router.get('/getuser',auth,getUser)
router.get('/getalluser',auth,getAllUser)
router.patch('/editdata',auth,editData)
router.patch('/changepassword',auth,changePassword)
router.delete('/loginout',auth,loginOut)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token',resetPassword)




module.exports = router;