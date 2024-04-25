const mongoose = require('mongoose'); 

var coursesSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    price:{
        type:Number,
    },
    subject:{
        type:String,
    },
    collegeName:{
        type:String,
        trim:true
    },
    UniversityName:{
        type:String,
        trim:true
    },
    level:{
        type:String,
        trim:true,
    },
    departement:{
        type:String,
        trim:true,
    },
    
    Teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Teacher"
    },
    Teachername:{
        type:String,
    },
    freeTrial:{
        type:Boolean,
        default:false
    },
    videos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    photo:{
        type:String,
    },
    videoslist:[
        {
            name:{
                type:String,
               
            },
            videoURL:{
                type:String,
            },
            description:{
                type:String
            },
            Teacher:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Teacher"
            },
            course:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Courses"
            },
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Video"
            },
            TeacherName:{  
                type:String
        
            },

            CourseName:{  
                type:String
        
            },
        }
    ],
    codes: {
        type: [String],
        default: []
      },
    usedCodes:{
         type: [String],
        default: []
    }
  
},
{
    timestamps:true
}


);

module.exports = mongoose.model('Courses', coursesSchema);
