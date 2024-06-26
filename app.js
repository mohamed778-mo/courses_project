const express = require('express');
const cors = require('cors');
const connection = require("./connection/config");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const bodyParser = require("body-parser");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

const app = express();
app.use(express.json());


app.use(cookieParser());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const teacherRouter = require('./routers/teacher_router');
const courseRouter = require('./routers/courses_router');
const uploadVideoRouter = require('./routers/video_router');
const examRouter = require('./routers/exam_router');
const QbankRouter = require('./routers/questions_bank_route');

const studentRouter = require('./routers/student_router');
const course_student = require('./routers/courses_student_router')
const video_student =require('./routers/video_student_router')
const exam_student =require('./routers/exam_student_router')

const pdf_upload = require('./routers/uploads_router')

// const blogStudentRouter = require('./routers/blog_student_router');
// const blogTeacherRouter = require('./routers/blog_teacher_router');
// const blogCourseRouter = require('./routers/blog_course_router');

app.use('/app/teacher', teacherRouter);
app.use('/app/course', courseRouter);
app.use('/app/video', uploadVideoRouter);
app.use('/app/teacher/exam', examRouter);
app.use('/app/questionbank', QbankRouter);

app.use('/app/student', studentRouter);
app.use('/app/student/course', course_student);
app.use('/app/student/exam', exam_student);
app.use('/app/student/video', video_student);

app.use('/app/pdf', pdf_upload);

// app.use('/app/blog/student', blogStudentRouter);
// app.use('/app/blog/teacher', blogTeacherRouter);
// app.use('/app/blog/course', blogCourseRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connection();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Connection on port ${port}`);
});
