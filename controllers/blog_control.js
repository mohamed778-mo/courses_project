const Blogs = require("../models/blog_student_model")
const Blogs_2 = require ("../models/blog_teacher_model")
const Blogs_3 = require ("../models/blog_course_model")
const Teacher=require("../models/teacher_model")
const Student=require("../models/student_model")
const Courses = require("../models/courses_model")
const cloudinary =require('cloudinary').v2
require("dotenv").config()

const blogcontroller = {

    createBlog : async(req,res)=>{
        cloudinary.config({ 
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY ,
            api_secret:process.env.API_SECRET ,
            secure:true
          })
        try {
            cloudinary.uploader.upload( req.file.path , { resource_type:"image", folder:"studentphoto" }, 
            function(error, result) {
                const photo_url = result.url;
                Student.findById(req.user._id).then((student) => {
                    student.photo = photo_url
                    student.save()
                    return(student)
                }).then((result)=>{
                    res.status(200).send(result)
                })

            })

            // const blog = req.body
            // const newBlog = new Blogs({blog,owner:req.user._id})
            // if(req.file){
            //     newBlog.image=`/blog/${req.file.filename}`
            // }
            // await newBlog.save()
            // res.send(newBlog)

        } catch (e) {
            res.status(500).send(e.message)
        }
    },
    createBlog_2 : async(req,res)=>{
        cloudinary.config({ 
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY ,
            api_secret:process.env.API_SECRET ,
            secure:true
          })
        try {
        cloudinary.uploader.upload( req.file.path , { resource_type:"image", folder:"teacherphoto" },  
            function(error, result) {
                const photo_url = result.url;
                Teacher.findById(req.user._id).then((teacher) => {
                    teacher.photo = photo_url
                    teacher.save()
                    return(teacher)
                }).then((result)=>{
                    res.status(200).send(result)
                })
            })
            // const blog_2 = req.body
            // const newBlog_2= new Blogs_2({blog_2,owner:req.user._id})
            // if(req.file){
            //     newBlog_2.image=`/blog/${req.file.filename}`
            // }
            // await newBlog_2.save()
            // res.send(newBlog_2)
        } catch (e) {
            res.status(500).send(e.message)
        }
    },
    createBlog_3 : async(req,res)=>{
        cloudinary.config({ 
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY ,
            api_secret:process.env.API_SECRET ,
            secure:true
          })
        try {
        cloudinary.uploader.upload( req.file.path , { resource_type:"image", folder:"coursephoto" },  
            function(error, result) {
                const photo_url = result.url;
                Courses.findById(req.body.course).then((course) => {
                    course.photo = photo_url
                    course.save()
                    return(course)
                }).then((result)=>{
                    res.status(200).send(result)
                })
            })

        // try {
        //     const blog_3 = req.body
        //     const newBlog_3= new Blogs_3({blog_3,owner:req.user._id})
        //     if(req.file){
        //         newBlog_3.image=`/blog/${req.file.filename}`
        //     }
        //     await newBlog_3.save()
        //     res.send(newBlog_3)
        // }      
        }catch (e) {
            res.status(500).send(e.message)
        }
    }


} 

 

module.exports=blogcontroller;