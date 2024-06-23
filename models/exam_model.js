const mongoose = require('mongoose'); 

var examSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    subject:{
        type:String
    },
    level:{
        type:String
    },
    departement:{
        type:String
    },
    total_mark:{
        type:Number
    }, 
    start:{
        type:String
    },
    end:{
        type:String
    },
    Teacher_Name:{
        type:String
    }
    ,
    Teacher_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Teacher"
    } ,
     Course_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses"
    }
    ,
    Questions:[
    {
        question:{
            type:String
        },
        img:{
            type:String
        }
        ,
        answer_1:{type:String},
        answer_2:{type:String},
        answer_3:{type:String},
        answer_4:{type:String},

        mark:{
            type:Number
        }, 
        role:{
            type:String,
            enum:['choice','boolean']
        },
        correctChoice:{
            type:String
        },
        correctBoolean:{
            type:String
                },

    }]
    ,
  results_available:{
    type:Boolean,
    default:false
  }

});

module.exports = mongoose.model('Exam', examSchema);