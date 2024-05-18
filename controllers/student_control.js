const Student=require("../models/student_model")
const Teacher = require("../models/teacher_model")
const bcryptjs = require('bcryptjs')
const jwt=require("jsonwebtoken")
const  mongoose  = require('mongoose')
const nodemailer = require("nodemailer")
require("dotenv").config()
const crypto=require("crypto")

const Register = async(req,res)=>{
    try {
        const user = req.body
        const dublicatedEmail = await Student.findOne({email:user.email})
        if(dublicatedEmail){
            return res.status(400).send('Email already exist!!')
        }        
        const dublicatedPhone = await Student.findOne({mobile:user.mobile})
        if(dublicatedPhone){
            return res.status(400).send('mobile already exist!!')
        }       

        const newUser = new Student(user)
        await newUser.save() 
        const Message = `${process.env.BASE_URL}/app/student/verfiy/${newUser._id}`
        
        const transporter = nodemailer.createTransport({
          service:process.env.SERVICE,
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_PASS,
            },
          });
          
          async function main() {
          const info = await transporter.sendMail({
              from: process.env.USER_EMAIL, 
              to: newUser.email , 
              subject: "Verfiy your gmail", 
              html: `<b> Verfiy your gmail </b><P> check link ${Message} </P> <P> expires after 6 h !!</P>`, 
           
            });
          
            console.log("Message sent");
        
          
          }
          
          main().catch(console.error);
          
          res.status(200).send('check your email to verfiy !!')
       
    
    } catch (error) {res.status(500).send(error.message)}
}

const VerifiyEmail=async(req,res)=>{
    try {
        const user = await Student.findOne({_id:req.params.id})
        if(!user){
            res.status(404).send("invalid link!")
        }
        const id = req.params.id
        await Student.updateOne(id,{verified:true ,new:true})
         
    res.status(200).send(" Email is verified and sign up is success!!  ")
    } catch (e) {
        res.status(500).send(e.message)
    }
}

const Login = async(req,res)=>{
    try {
        const {email,password}=req.body
        const user = await Student.findOne({email:email})
        if(!user){
           return res.status(404).send("EMAIL OR PASSWORD NOT CORRECT ")
        }
        const isPassword = await bcryptjs.compare(password,user.password);
        if(!isPassword){
            return res.status(404).send("EMAIL OR PASSWORD NOT CORRECT ")
         }
        
         const SECRETKEY = process.env.SECRETKEY
         const token = await jwt.sign({id:user._id},SECRETKEY)
         res.cookie("access_token",`Bearer ${token}`,{
         expires:new Date(Date.now()+60*60*24*1024*300),
            httpOnly : true
         })
         
         user.tokens.push(token)
         user.save()

        res.status(200).send("login is success")


    } catch (error) {res.status(500).send(error.message)}
}
const getUser = async(req,res)=>{
    try{
    const {id:_id} = req.user
    const data = await Student.findById(_id)
    if(data.isBlocked==true){
        return res.status(500).send(" You are blocked !!")

    }
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send(" ID is not correct!")
    }
    
    const user = await Student.findById(_id)
    if(!user){
        return res.status(404).send(" please SignUp ")
    }


    res.status(200).send(user)

}catch(e){res.status(500).send(e.message)}
}

const getAllUser=async(req,res)=>{
    try{
const user = req.user._id
const data = await Student.findById(user)
if(data.isBlocked==true){
    return res.status(500).send(" You are blocked !!")

}

const allData = await Teacher.find()

res.status(200).send(allData)

    }catch(e){res.status(500).send(e.message)}
}

const editData=async(req,res)=>{
    try{
        const {id:_id} = req.user
        const data = await Student.findById(_id)

        if(data.isBlocked==true){
            return res.status(500).send(" You are blocked !!")
    
        }
        if(!mongoose.Types.ObjectId.isValid(_id)){
            return res.status(404).send('ID is not correct!!')
        }
         Student.findByIdAndUpdate(_id,req.body,{new:true}).then((newuser)=>{newuser.save()})
        
       
        res.status(200).send(' Update data is success ! ')

    }catch(e){res.status(500).send(e.message)}
}

const changePassword=async(req,res)=>{
    const {id:_id} = req.user
    const data = await Student.findById(_id)
    if(data.isBlocked==true){
        return res.status(500).send(" You are blocked !!")

    }
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('ID is not correct!!')
    }
    const {OldPassword,NewPassword}=req.body
    const user = await Student.findById(_id)
    const isPassword = await bcryptjs.compare(OldPassword,user.password)
    if(!isPassword){
        return res.status(404).send(' Old Password is not correct, please write your correct password')
    }
    user.password = NewPassword
    user.save()
    res.status(200).send('PASSWORD is changed !!')
}

 const loginOut = async(req,res)=>{
try{
  
        req.user.tokens =[]
        res.clearCookie("access_token", {sameSite: "none", secure: true,}).status(200).send("login out is success.")  
      
      }catch(e){
    res.status(500).send(e.message)
}

}


const forgetPassword=async(req,res)=>{
    try{
       

    const user = req.body
    const dubUser = await Student.findOne({email:user.email})
     if(!dubUser){
      return res.status(404).send(" email is not exist , please write a correct email ")
     }
    const SEKRET = process.env.SECRET
    const resettoken = crypto.randomBytes(32).toString("hex");
    dubUser.passwordResetToken=crypto.createHmac('sha256',SEKRET).update(resettoken).digest('hex')
    
     const token= dubUser.passwordResetToken
     await dubUser.save()
     const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      service:process.env.SERVICE,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });
    const Message = `${process.env.BASE_URL}/app/student/resetpassword/${token}`
    
    async function main() {
      const info = await transporter.sendMail({
        from: process.env.USER_EMAIL, 
        to: dubUser.email , 
        subject: " RESET PASSWORD ", 
        html: `<P>hello ${dubUser.email} go to link ${Message} for "RESET PASSWORD" </P> <P> expires after 6 h !!</P>`, 
      });
    
      console.log("Message sent");
  
    
    }
    
    main().catch(console.error);
    
    res.status(200).send(" check your email to reset password !")
  
  
  } catch (error) {res.status(500).send(error.message)}
  }
  
  
  
  const resetPassword = async (req, res) => {
    try{  
      
      const  { password } = req.body;
      const  token = req.params.token; 
      const user = await Student.findOne({
        passwordResetToken: token,
      });
      if (!user) throw new Error(" Token Expired, Please try again later");
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.passwordChangedAt = Date.now();
  
      await user.save();
      console.log(user)
      res.status(200).send(`PASSWORD IS CHANGED !!`);
    
  
  }catch(e){res.status(500).send(e.message)}
  }







module.exports = {
    Register,
    Login,
    getUser,
    getAllUser,
    editData,
    changePassword,
    loginOut,
    VerifiyEmail,
    forgetPassword,
    resetPassword

} ;
