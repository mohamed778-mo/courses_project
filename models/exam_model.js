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
            enum:['choice','bolean']
        },
        correctChoice:{
            type:String
        },
        correctBolean:{
            type:String
                },

    }]
    ,
  

});

module.exports = mongoose.model('Exam', examSchema);