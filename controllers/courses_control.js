const Courses = require("../models/courses_model");
const Student = require("../models/student_model");
const Teacher = require("../models/teacher_model");
const mongoose = require("mongoose");
const crypto = require("crypto");
const admin = require('firebase-admin');
const fs = require('fs');
require('dotenv').config();

const serviceAccount =JSON.parse(process.env.SERVER)

const createCourse = async (req, res) => {
  try {
    const T_id = req.user._id;
    if (!T_id) {
      return res.status(404).send("please login!!");
    }
    const {
      title,
      price,
      subject,
      collegeName,
      UniversityName,
      level,
      departement,
    } = req.body;

const file = req.files.find(f => f.fieldname === 'file')
  if(file){
        
        if (!file) {
          return res.status(400).send('No file uploaded.');
        }
      
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
              const newCourse = new Courses({ ...req.body, Teacher: req.user._id, Teachername: req.user.FirstName+' '+req.user.LastName , photo:publicUrl});
               await newCourse.save();
await Teacher.findById(T_id).then((f) => {
      f.myCourses.push(newCourse._id);
      f.save();
    });
    await newCourse.save();
               res.status(200).send(newCourse)
              } catch (err) {
                reject(err);
              }
            });

            fs.createReadStream(file.path).pipe(blobStream);
          });
      
  
      }
      

  if(!file){
    
    const newCourse = new Courses({ ...req.body, Teacher: req.user._id, Teachername: req.user.FirstName+' '+req.user.LastName , photo:"empty"});
               await newCourse.save();
await Teacher.findById(T_id).then((f) => {
      f.myCourses.push(newCourse._id);
      f.save();
    });
    await newCourse.save();
       res.status(200).send(newCourse)
      
  }
    

  } catch (e) {
    res.status(500).send(e.message);
  }
};

const getDetailsCourse = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send(" ID is not correct!");
    }
    const data = await Courses.findById(_id);
    if (!data) {
      return res.status(404).send(" Course is not exist !! ");
    }
 
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const getCourse = async (req, res) => {
  try {
    
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send(" ID is not correct!");
    }
    const data = await Student.findById(_id);
    if (!data) {
      return res.status(404).send(" Course is not exist !! ");
    }
    const course = data.myCourses;
    res.status(200).send(course);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const getMyCourses = async (req, res) => {
  try {
    const teacher_id = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(teacher_id)) {
      return res.status(404).send("your ID is not correct!!");
    }
    const courses = await Courses.find({ Teacher: teacher_id });

    res.status(200).send(courses);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const getStudentCourses = async (req, res) => {
  try {
    const allData = await Courses.find({
      level: req.user.level,
      departement: req.user.departement,
    }).lean();

    let sentData = allData.map((course) => {
     
      delete course.codes;
      delete course.usedCodes;

    
      course.videoslist = course.videoslist.map((video) => {
        if (video.type !== "free") {
          video.videoURL = "";
        }
        return video;
      });

      return course;
    });

    res.status(200).send(sentData);
  } catch (e) {
    res.status(500).send(e.message);
  }
};


const buycourse = async(req,res)=>{         
  try{
      const code =req.body.code
      const {id:_id} = req.params
      const course = await Courses.findById(_id)
      if(!course){ return res.status(404).send("Non valid course") } 
      
      const title = course.title
      const departement = course.departement
      const level = course.level
      const UniversityName = course.UniversityName
      const subject = course.subject
      const price = course.price
      const collegeName = course.collegeName
      const teacher=course.Teacher

      const student_id=req.user._id  
      const student_data = await Student.findById(student_id)

      const response =()=>{res.status(200).send(course)} 

      const idObject = new mongoose.Types.ObjectId(_id);
      const courseExists = student_data.myCourses.some(course => course._id.equals(idObject));

      if( courseExists ){
         return response()
        }
  
        const check = await Courses.findOne( {codes:code}  )
        if ( ! check  )   {
  
     return  res.status(400).send({ error: 'Invalid code.' })
        }
    
        const usedCodes=await Courses.findOne({usedCodes:code})

        if (usedCodes) {
          return res.status(400).json({ error: 'Code has already been used.' });
        }
  
        course.usedCodes.push(code)
        
        await Courses.updateOne({"_id":_id},{"$pull":{"codes":code}})

course.save()


  await Student.findById(req.user._id).then((student)=>{
      student.myCourses.push({_id,teacher,title,collegeName,price,subject,UniversityName,level,departement})
      student.save()     

})

 const addSTUDENT = async()=>{  
  await Teacher.findById(course.Teacher._id).then((teacher)=>{
      teacher.myStudents.push(req.user._id)
      teacher.save()     
})
}

const data_1 = await Teacher.findById(course.Teacher._id)
if( ! data_1.myStudents.includes(req.user._id) ){
   addSTUDENT()
}

const addTeacher = async()=>{
    await Student.findById(req.user._id).then((student)=>{
 
  student.teachers.push(course.Teacher._id)
 student.save()     

})
}
const data_2=await Student.findById(req.user._id)
if( ! data_2.teachers.includes(course.Teacher._id) ){
   addTeacher()
}

 

student_data.save()

res.status(200).send(course)
}catch(e){res.status(500).send(e.message)}
}

const getpaidcourses = async (req, res) => {
  try {
    const { myCourses } = req.user;

    Courses.find({ _id: { $in: myCourses } }).then((courses) => {
      res.status(200).send(courses);
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const editData = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const teacher_id = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(teacher_id)) {
      return res.status(404).send("your ID is not correct!!");
    }
    const { title, level, price, subject } = req.body;
    const newdata = await Courses.findByIdAndUpdate(_id, req.body, {
      new: true,
    });

    console.log(newdata);

    res.status(200).send("Update data is success ");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const deleteOneData = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("ID is not correct!!");
    }
    const course = await Courses.findByIdAndDelete(_id);
    res.status(200).send(" Delete data is success ! ");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const deleteAllData = async (req, res) => {
  try {
    await Courses.deleteMany();

    res.status(200).send(" Delete All data is success ! ");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const deleteCourseThatinStudent = async (req, res) => {
  try {
    const S_id = req.body.student_id;
    const C_id = req.body.course_id;
    if (!(await Courses.findById(C_id))) {
      return res.status(404).send("course not exist ");
    }
    const data_student = await Student.findById(S_id);
    const newCourse = data_student.myCourses.filter((e) => {
      return e._id !== C_id;
    });
    
    

    const newdata = await Student.findByIdAndUpdate(S_id, data_student).then(
      (f) => {
        f.save();
      }
    );

    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
};
const createCode =async(req,res)=>{
  try{
  const code_1 = crypto.randomBytes(8).toString("hex")

  const course_id =req.params.course_id
  const data = await Courses.findById(course_id)
  data.codes.push(code_1)
  data.save()
  res.status(200).send({ NewCode:code_1 ,  AllCodes :data.codes })
}catch(e){res.status(500).send(e.message)}
}
const getCodes =async(req,res)=>{
  const teacher_id=req.user._id
  if(!mongoose.Types.ObjectId.isValid(teacher_id)){
      return res.status(404).send('your ID is not correct!!')
  }        
  const course_id=req.params.course_id
  const data = await Courses.findById(course_id)
  res.status(200).send(data.codes)

}
const getusedCodes =async(req,res)=>{
  const teacher_id=req.user._id
  if(!mongoose.Types.ObjectId.isValid(teacher_id)){
      return res.status(404).send('your ID is not correct!!')
  }        
  const course_id=req.params.course_id
  const data = await Courses.findById(course_id)
  res.status(200).send(data.usedCodes)
}








module.exports = {
  createCourse,
  getCourse,
  getMyCourses,
  editData,
  deleteOneData,
  deleteAllData,
  getStudentCourses,
  buycourse,
  getpaidcourses,
  deleteCourseThatinStudent,
  createCode,
  getCodes,
  getusedCodes,
  getDetailsCourse
};
