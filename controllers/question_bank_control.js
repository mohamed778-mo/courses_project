const Question = require('../models/questions_bank_model');  
const admin = require('firebase-admin');
const fs = require('fs');
require('dotenv').config();

const serviceAccount =JSON.parse(process.env.SERVER)


const add_question = async (req, res) => {
  try {
    const { question, answer_1, answer_2, answer_3, answer_4, mark, role, correctBoolean, correctChoice ,year,lec} = req.body;
    const file = req.files.find(f => f.fieldname === 'file')

  if(file){
        
        if (!file) {
          return res.status(400).send('No file uploaded.');
        }
      
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.STORAGE_BUCKET
          });

          const bucket = admin.storage().bucket();
          const blob = bucket.file(file.filename);
          const blobStream = blob.createWriteStream({
            metadata: {
              contentType: file.mimetype
            }
          });


          await new Promise((reject) => {
            blobStream.on('error', (err) => {
              reject(err);
            });

            blobStream.on('finish', async () => {
              try {
                await blob.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                fs.unlinkSync(file.path);
                const newQuestion = new Question({
                  question,
                  img: publicUrl ,
                  answer_1,
                  answer_2,
                  answer_3,
                  answer_4,
                  mark,
                  role,
                  correctBoolean,
                  correctChoice,
                  year,
                  lec
                });
               await newQuestion.save();

               res.status(200).send(newQuestion)
              } catch (err) {
                reject(err);
              }
            });

            fs.createReadStream(file.path).pipe(blobStream);
          });
      
  
      }
      

  if(!file){
    
   let newQuestion = new Question({
          question,
          img: 'empty' ,
          answer_1,
          answer_2,
          answer_3,
          answer_4,
          mark,
          role,
          correctBoolean,
         correctChoice,
         year,
         lec
        });
       await newQuestion.save();
       res.status(200).send(newQuestion)
      
  }


  }catch (e) {
    res.status(500).send(e.message);
  }
}

const get_Questions= async (req, res) => {
    try {
      const questions = await Question.find();
      res.status(200).send(questions);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }

const get_Question= async (req, res) => {
    try {
      const question_id = req.params.question_id
      const data = await Question.findById(question_id)
      res.status(200).send(data);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }

const delete_question = async (req, res) => {
    try {
      const questionId = req.params.question_id;
      const deletedQuestion = await Question.findByIdAndDelete(questionId);
  
      if (!deletedQuestion) {
        return res.status(404).send("Question not found");
      }
  
      res.status(200).send({ message: "Question deleted successfully" });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
  
 
const edit_question = async (req, res) => {
    try {
      const questionId = req.params.question_id;
      const { question, answer_1, answer_2, answer_3, answer_4, mark, role, correctBoolean, correctChoice ,year,lec} = req.body;
  
      const updateData = {
        question,
        answer_1,
        answer_2,
        answer_3,
        answer_4,
        mark,
        role,
        correctBoolean,
        correctChoice,
        year,
        lec
      };
  
     
  if(req.file){
       
          
          const file = req.file
    
          if (!file) {
            return res.status(400).send('No file uploaded.');
          }
        
          
        
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.STORAGE_BUCKET
          });
          
          const bucket = admin.storage().bucket();
          const blob = bucket.file(file.filename);
          const blobStream = blob.createWriteStream({
            metadata: {
              contentType: file.mimetype
            }
          });


          await new Promise((reject) => {
            blobStream.on('error', (err) => {
              reject(err);
            });

            blobStream.on('finish', async () => {
              try {
                await blob.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                fs.unlinkSync(file.path);
              
                updateData.img = publicUrl;

                
              } catch (err) {
                reject(err);
              }
            });

            fs.createReadStream(file.path).pipe(blobStream);
          });
        
         
        }
if(!req.file){
  updateData.img = 'empty'
}
  
      const updatedQuestion = await Question.findByIdAndUpdate(questionId, updateData, { new: true });
  
      if (!updatedQuestion) {
        return res.status(404).send("Question not found");
      }
  
      res.status(200).send(updatedQuestion);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
  

module.exports = {
    add_question,
    get_Questions,
    get_Question,
    delete_question,
    edit_question
};
