const admin = require('firebase-admin');
const fs = require('fs');
const Courses = require("../models/courses_model");
const Uploads = require("../models/uploads_model")
const Img = require("../models/img_upload_model")

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

const delete_pdf = async (req, res) => {
    try {
        const pdf_id = req.params.pdf_id;
        const pdf_det = await Uploads.findById(pdf_id);
        
        if (!pdf_det) {
            return res.status(404).send('PDF not found.');
        }

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: process.env.STORAGE_BUCKET
            });
        }

        const bucket = admin.storage().bucket();
        const file_name = pdf_det.pdf.split('/').pop();
        const file = bucket.file(file_name);

        await file.delete();

        
        await Uploads.findByIdAndDelete(pdf_id);

        res.status(200).send("File and database record deleted successfully!");
    } catch (e) {
        res.status(500).send(e.message);
    }
};


const get_pdfs =  async (req,res)=>{

    try{
    const course_id = req.params.course_id
    const pdfs = await Uploads.find({Course_Id:course_id})
    
    res.status(200).send(pdfs)
    
    }catch(e){res.status(500).send(e.message)}
    
}


const upload_images = async (req, res) => {
    try {
        const files = req.files; 
        if (!files || files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: process.env.STORAGE_BUCKET
            });
        }

        const bucket = admin.storage().bucket();
        
        const group_name = req.body.group_name;
        const year = req.body.year;
        const lec = req.body.lec;
        const teacher_id = req.user._id;
        const teacher_name = req.user.FirstName + ' ' + req.user.LastName;
        const course_id = req.params.course_id;
        const data_course = await Courses.findById(course_id);
        const course_name = data_course.subject;

        const imagePromises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const blob = bucket.file(file.originalname);
                const blobStream = blob.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });

                blobStream.on('error', (err) => {
                    console.error(err);
                    reject('Error uploading file.');
                });

                blobStream.on('finish', () => {
                    blob.makePublic().then(() => {
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                        fs.unlinkSync(file.path);
                        resolve({
                            
                            url: publicUrl,
                           
                        });
                    }).catch((err) => {
                        console.error(err);
                        reject('Error making file public.');
                    });
                });

                fs.createReadStream(file.path).pipe(blobStream);
            });
        });

        const images = await Promise.all(imagePromises);

        const save_data = new Img({
            group_name: group_name,
            year:year,
            lec:lec,
            teacher_id:teacher_id,
            teacher_name:teacher_name,
            course_id:course_id,
            course_name:course_name,
            images: images
        });

        await save_data.save();

        res.status(200).send({ data: save_data, images });
    } catch (e) {
        res.status(500).send(e.message);
    }
};

const get_imgs =  async (req,res)=>{

    try{
    const course_id = req.params.course_id
    const imgs = await Img.find({Course_Id:course_id})
    
    res.status(200).send(imgs)
    
    }catch(e){res.status(500).send(e.message)}
    
}

const get_img =  async (req,res)=>{

    try{
    const img_id = req.params.img_id
    const img = await Img.findById(img_id)
    
    res.status(200).send(img)
    
    }catch(e){res.status(500).send(e.message)}
    
}


const delete_image = async (req, res) => {
    try {
        const img_id = req.params.img_id;
        
      
        const imgData = await Img.findById(img_id);
        if (!imgData) {
            return res.status(404).send('Image not found');
        }

      
        const imageUrls = imgData.images.map(image => image.url);
        const bucket = admin.storage().bucket();

   
        const deletePromises = imageUrls.map((url) => {
            const filePath = url.split(`${bucket.name}/`)[1]; 
            return bucket.file(filePath).delete();
        });

     e
        await Promise.all(deletePromises);

   
        await Img.findByIdAndDelete(img_id);

        res.status(200).send({ message: 'Image and associated data deleted successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
};


  module.exports = {
    upload_pdf,get_pdf,delete_pdf,get_pdfs ,
      upload_images , get_imgs , get_img , delete_image
  }
