const mongoose = require('mongoose');

const UploadsSchema = new mongoose.Schema({
    group_name: { 
      type: String, 
      required: true
    },
  
  Teacher_Id: {
   type: mongoose.Schema.Types.ObjectId
},
  
  Teacher_Name:{ 
     type: String, 
  },
  
   Course_Id: {
   type: mongoose.Schema.Types.ObjectId
},
  
  Course_Name: {
     type: String, 
  },
  
   year: {
      type: String, 
   },
  
   lec:{ 
      type: String, 
   },
  
    images: [
        {
            
            url: String,
            
        }
    ]
});

const Uploads = mongoose.model('Uploads', UploadsSchema);
module.exports = Uploads;
