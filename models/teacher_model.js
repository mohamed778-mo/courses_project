const mongoose = require('mongoose')
const validator=require('validator')
const bcryptjs = require('bcryptjs')


var teacherSchema = new mongoose.Schema({
    FirstName:{
        type:String,
        required:true,
        trim:true,
        
    },
    LastName:{
        type:String,
        required:true,
        trim:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(valu){
            if(!validator.isEmail(valu)){
                throw new Error("Invalid email")
            }
        }
    },
    verified:{
        type:Boolean,
        default:false
      },
    mobile:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
        validate(value){
            const StrongPassword = new RegExp("^(?=.*[a-z])(?=.*[0-9])")
            if(!StrongPassword.test(value)){
              throw new Error(" Password must contain ' ^(?=.*[a-z])(?=.*[0-9]) ' ")
            }
          }
    },
    tokens:[
        {
            type:String,
            expires:"300d"
        }
    ],
    isAdmin:{
        type:Boolean,
        default:true
    },

    role:{
        type:String,
        enum:['teacher','doctor']
    },
    UniversityName:{
        type:String,
        trim:true
    },
    CollegesName:{
        type:String,
        trim:true
    },
    myCourses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Courses"
        }
    ] 

,
   myStudents:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    }
] ,
    photo:{
        type:String,
    },
    passwordChangedAt: {
        type:Date
    },
    passwordResetToken: {
        type:String
    },
    passwordResetExpires: {
        type:Date
    },

}
,
{
 timestamps:true
}
);

teacherSchema.pre("save",async function(){

    try {
     const user = this 
        if(!user.isModified("password")){
        
          return
        }
            user.password = await bcryptjs.hash( user.password , 8)
      
      }
   catch (error) {
        console.log(error)
  } 
     })     
    
     teacherSchema.methods.toJSON = function(){
        const user = this 
        const dataToObject = user.toObject()
        delete dataToObject.password
        delete dataToObject.tokens
       
        return dataToObject
      }
      


module.exports = mongoose.model('Teacher', teacherSchema);