const admin = require('firebase-admin');
const fs = require('fs');
const Courses = require("../models/courses_model");
const Uploads = require("../models/uploads_model")
require('dotenv').config();

const serviceAccount =JSON.parse(process.env.SERVER)



const upload_pdf =async (req, res) => {
    try{
    const file = req.files.find(f => f.fieldname === 'file')
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
  if (file) {
          if (!admin.apps.length) {
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
              storageBucket: process.env.STORAGE_BUCKET
            });
          }
    
    const bucket = admin.storage().bucket();
    const blob = bucket.file(file.filename);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: 'application/pdf'
      }
    });
            const pdf_name = req.body.name
            const year = req.body.year
            const lec = req.body.lec
            const teacher_id = req.user._id
            const teache_name = req.user.FirstName +' '+req.user.LastName
            const course_id = req.params.course_id
            const data_course = await Courses.findById(course_id)
            const course_name = data_course.subject
        
    blobStream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Error uploading file.');
    });
  
    blobStream.on('finish', () => {
        

        blob.makePublic().then(async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            fs.unlinkSync(file.path); 
       
          
        const save_data = new Uploads({
            name : pdf_name,
            pdf : publicUrl,
            Teacher_Id : teacher_id,
            Teacher_Name : teache_name,
            Course_Id : course_id,
            Course_Name : course_name,
            year : year,
            lec : lec
        
        })
        await save_data.save()
        
        res.status(200).send({data : save_data , pdf_link :publicUrl })

        }).catch(err => {
            console.error(err);
            res.status(500).send('Error making file public.');
        });
    });
  

    fs.createReadStream(file.path).pipe(blobStream);
            }

}catch(e){res.status(500).send(e.message)}
  
}
const get_pdf = async (req,res)=>{

try{
const pdf_id = req.params.pdf_id
const pdf_det = await Uploads.findById(pdf_id)

res.status(200).send(pdf_det)

}catch(e){res.status(500).send(e.message)}

}

const delete_pdf = async (req,res)=>{

    try{
    const pdf_id = req.params.pdf_id
    await Uploads.findByIdAndDelete(pdf_id)
    
    res.status(200).send("delete is success !!")
    
    }catch(e){res.status(500).send(e.message)}
    
}

const get_pdfs =  async (req,res)=>{

    try{
    const course_id = req.params.course_id
    const pdfs = await Uploads.find({Course_Id:course_id})
    
    res.status(200).send(pdfs)
    
    }catch(e){res.status(500).send(e.message)}
    
}



  module.exports = {
    upload_pdf,get_pdf,delete_pdf,get_pdfs
  }
