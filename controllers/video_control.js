const Video = require("../models/upload_video_model");
const Courses = require("../models/courses_model");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const mongoose = require("mongoose");
const crypto = require("crypto");
const Student = require("../models/student_model")
const Vimeo = require('vimeo').Vimeo;



const uploadVideo = async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
  });
  try {
    cloudinary.uploader.upload(
      req.file.path,
      { resource_type: "video", folder: "video" },

      async function (error, result) {
        const course = await Courses.findById(req.params.course_id);

        const newvideo = new Video({
          name: req.file.originalname,
          videoURL: result.url,
          description: req.body.description,
          Teacher: req.user._id,
          course: req.params.course_id,
          CourseName: course.subject,
          TeacherName: req.user.FirstName +' '+req.user.LastName,
        });

        newvideo.save();

        const id = req.params.course_id;
        Courses.findById(id).then((course) => {
          course.videoslist.push({
            id: newvideo._id,
            name: newvideo.originalname,
            videoURL: newvideo.videoURL,
            description: newvideo.description,
            Teacher: newvideo.Teacher,
            course: newvideo.course,
            CourseName: course.subject,
            TeacherName: req.user.FirstName + req.user.LastName,
          });

          course.save();
        });
        res.status(200).send(newvideo);
      }
    );
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const postvideofromviemotoDB = async(req,res)=>{
  try{
  const client_id =process.env.CLIENT_ID
  const client_secret =process.env.CLIENT_SECRETS
  const token =process.env.TOKEN
    
  const client = new Vimeo(client_id, client_secret , token);

  const videoId = req.body.videoId;
  
client.request({
 method: 'GET',
 path: `/videos/${videoId}`
},
async (error, body) => {
 if (error) {
   return res.status(400).send('error in "videoId" , not exist  !! ');

 }

const type = req.body.type
const description = req.body.description
const course_id = req.params.course_id

 const course = await Courses.findById(course_id);
 if(!course){
  return res.status(404).send("not exist")
 }

 const newvideo = new Video({
   name: body.name,
   videoURL: body.player_embed_url,
   description: description,
   Teacher: req.user._id,
   course: course_id,
   CourseName: course.subject,
   TeacherName: req.user.FirstName + req.user.LastName,
   type:type
 });

 newvideo.save();

 
 Courses.findById(course_id).then((course) => {
   course.videoslist.push({
     id: newvideo._id,
     name: newvideo.name,
     videoURL: newvideo.videoURL,
     description: newvideo.description,
     Teacher: newvideo.Teacher,
     course: newvideo.course,
     CourseName: course.subject,
     TeacherName: req.user.FirstName + req.user.LastName,
     type:newvideo.type
   });

   course.save();
res.status(200).send(newvideo)
})


})
}catch(e){res.status(500).send(e.message)}
};

const getVideoinCourse = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const data = await Courses.findById(course_id);
    const dataVideos = data.videoslist;
    res.status(200).send(dataVideos);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
const deletevideo = async (req, res) => {
  try {
    const teacher_id = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(teacher_id)) {
      return res.status(404).send("your ID is not correct!!");
    }

    const video_id = req.params.video_id;
    await Video.findByIdAndDelete(video_id);
    const course_id=req.params.course_id

        
    await Courses.updateOne({"_id":course_id},{"$pull":{"videoslist":{"id":video_id}}})
    res.status(200).send({ message: "done deleted" });
  } catch (e) {
    res.status(500).send(e.message);
  }
};


const createCode = async (req,res)=>{
  try{
  const code_1 = crypto.randomBytes(4).toString("hex")
  const video_id =req.params.video_id
  const data = await Video.findById(video_id)
  data.codes.push(code_1)
  data.save()
  res.status(200).send({ NewCode:code_1 ,  AllCodes : "data is created" })
}catch(e){res.status(500).send(e.message)}
}
  
  const getCodes =async(req,res)=>{
  const teacher_id=req.user._id
  if(!mongoose.Types.ObjectId.isValid(teacher_id)){
      return res.status(404).send('your ID is not correct!!')
  }        
  const video_id=req.params.video_id
  const data = await Video.findById(video_id)
  res.status(200).send(data.codes)

}

const getusedCodes =async(req,res)=>{
  const teacher_id=req.user._id
  if(!mongoose.Types.ObjectId.isValid(teacher_id)){
      return res.status(404).send('your ID is not correct!!')
  }        
  const video_id=req.params.video_id
  const data = await Video.findById(video_id)
  res.status(200).send(data.usedCodes)

}

const buyVideo=async(req,res)=>{
  try{
      const data_s = await Student.findById(req.user._id)
      if(!mongoose.Types.ObjectId.isValid(data_s)){
          return res.status(404).send('please login !!')
      }     
      const video_id= req.params.video_id
        if(!mongoose.Types.ObjectId.isValid(video_id)){
          return res.status(400).send(" ID is not correct!")
      }
        const video = await Video.findById(video_id);    
  
        if (!video) {
          return res.status(404).send({ error: 'Video not found.' });
        }

        if(video.type === "paid"){

        const idObject = new mongoose.Types.ObjectId(video_id);
        const courseExists = data_s.myVideos.some(video => video._id.equals(idObject));
  
        if(courseExists){
            return res.status(200).send(video.videoURL);
          }


  
        const {code}=req.body
  
        const check = await Video.findOne( {codes:code}  )
        if ( ! check  )   {
  
        return  res.status(400).send({ error: 'Invalid code.' })
        }
  
        const usedCodes=await Video.findOne({usedCodes:code})
  
        if (usedCodes) {
          return res.status(400).json({ error: 'Code has already been used.' });
        }
  
         video.usedCodes.push(code)
         

      
    await Video.updateOne({"_id":video_id},{"$pull":{"codes":code}})

  
  video.save()
  
  const student = await Student.findById(req.user._id)
  student.myVideos.push({_id:video._id,videoURL:video.videoURL,description:video.description,CourseName:video.CourseName,TeacherName:video.TeacherName})
  student.save()
  
  
         res.status(200).json({videoURL:video.videoURL})
        }
if(video.type === "free"){
  res.status(200).json({videoURL:video.videoURL})
}


  }catch(e){res.status(500).send(e.message)}
  
  }

  const getvideosstudent = async(req,res)=>{
    try{
     const data_s = await Student.findById(req.user._id)
     if(!mongoose.Types.ObjectId.isValid(data_s)){
         return res.status(404).send('your ID is not correct!!')
     }     
     const videos = data_s.myVideos
     res.status(200).json(videos)
 }catch(e){res.status(500).send(e.message)}
 
 }









module.exports = {
  uploadVideo,
  getVideoinCourse,
  deletevideo,
  createCode,
  getCodes,
  getusedCodes,
  buyVideo,
  getvideosstudent,
  postvideofromviemotoDB
};
