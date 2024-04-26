const express=require('express')
const cors =require('cors')
const connection = require("./connection/config")
const cooikeparser = require("cookie-parser")
require("dotenv").config()
const bodyParser=require("body-parser")
const path = require("path")

const teacherRouter = require('./routers/teacher_router')
const studentRouter = require("./routers/student_router")
const courseRouter = require("./routers/courses_router")
const blogStudentRouter = require("./routers/blog_student_router")
const blogTeacherRouter = require("./routers/blog_teacher_router")
const blogCourseRouter = require("./routers/blog_course_router")
const uploadVideoRouter = require("./routers/video_router")
const examRouter = require("./routers/exam_router")



const app = express()

app.use(express.json())
app.use(cooikeparser())
app.use(bodyParser.json({ limit : "30mb" , extended : true }))
app.use(bodyParser.urlencoded({ limit : "30mb" , extended : true }))
app.use(cors())


app.use('/app/teacher',teacherRouter)
app.use('/app/student',studentRouter)
app.use('/app/course',courseRouter)
app.use('/app/blog/student',blogStudentRouter )
app.use('/app/blog/teacher',blogTeacherRouter )
app.use('/app/blog/course',blogCourseRouter)
app.use('/app/video',uploadVideoRouter)
app.use('/app/teacher/exam',examRouter)
app.use('/app/student/exam',examRouter)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connection()

const port = process.env.PORT||3000
app.listen(port,()=>{console.log(`done connection on port ${port}`)})





