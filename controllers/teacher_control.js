const Teacher = require("../models/teacher_model");
const Student = require("../models/student_model");
const Courses = require("../models/courses_model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const Register = async (req, res) => {
  try {
    const user = req.body;
    const dublicatedEmail = await Teacher.findOne({ email: user.email });
    if (dublicatedEmail) {
      return res.status(400).send("Email already exist!!");
    }
    const newUser = new Teacher(user);

    await newUser.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      service: process.env.SERVICE,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });
    const Message = `${process.env.BASE_URL}/app/teacher/verfiy/${newUser._id}`;

    async function main() {
      const info = await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: newUser.email,
        subject: "Verfiy your gmail",
        html: `<b> Verfiy your gmail </b><P> check link ${Message} </P> <P> expires after 6 h !!</P>`,
       
      });

      console.log("Message sent");
    }

    main().catch(console.error);

    res.status(200).send("check your email to verfiy !!");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const VerifiyEmail = async (req, res) => {
  try {
    const user = await Teacher.findOne({ _id: req.params.id });

    if (!user) {
      res.status(404).send("invalid link!");
    }
    const id = req.params.id;
    await Teacher.findByIdAndUpdate(id, { verified: true, new: true });

    res.status(200).send(" Email is verified and sign up is success!! ");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Teacher.findOne({ email: email });
    if (!user) {
      return res.status(404).send("EMAIL OR PASSWORD NOT CORRECT ");
    }
    const isPassword = await bcryptjs.compare(password, user.password);
    if (!isPassword) {
      return res.status(404).send("EMAIL OR PASSWORD NOT CORRECT ");
    }

    const SECRETKEY = process.env.SECRETKEY;
    const token = await jwt.sign({ id: user._id }, SECRETKEY);
    res.cookie("access_token", `Bearer ${token}`, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 1024 * 300),
      httpOnly: true,
    });

    user.tokens.push(token);
    user.save();
  
    res
      .status(200)
      .send({ access_token: `Bearer ${token}`, success: "Login is success!" });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};
const getUser = async (req, res) => {
  try {
    const { id: _id } = req.user;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send(" ID is not correct!");
    }
    const user = await Teacher.findById(_id);
    if (!user) {
      return res.status(404).send(" please SignUp ");
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send("Server Error");
  }
};

const getAllUser = async (req, res) => {
  try {
    const allData = await Teacher.find();
    res.status(200).send(allData);
  } catch (e) {
    res.status(500).send("Server Error");
  }
};

const editData = async (req, res) => {
  try {
    const { id: _id } = req.user;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("ID is not correct!!");
    }
    await Teacher.findByIdAndUpdate(_id, req.body, { new: true }).then(
      (newData) => {
        newData.save();
      }
    );
  } catch (e) {
    res.status(500).send("Server Error");
  }
};

const deleteCourseThatinStudent = async (req, res) => {
  try {
    const S_id = req.params.student_id;
    const C_id = req.params.course_id;
    const teacher_id = req.user._id;
    const check = await Courses.findOne({ teacher: teacher_id });
    if (!check) {
      return res.status(404).send(" this teacher you doesn't have this course");
    }
    await Student.updateOne(
      { _id: S_id },
      { $pull: { myCourses: { _id: C_id } } }
    );



    res.status(200).send("done delete");
  } catch (e) {
    res.status(500).send("Server Error");
  }
};
const deleteOneData = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("ID is not correct!!");
    }
    const user = await Student.findByIdAndDelete(_id);
    res.status(200).send(" Delete data is success ! ");
  } catch (e) {
    res.status(500).send("Server Error");
  }
};
const deleteAllData = async (req, res) => {
  try {
    await Student.deleteMany();

    res.status(200).send(" Delete All data is success ! ");
  } catch (e) {
    res.status(500).send("Server Error");
  }
};
const blockUser = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("ID is not correct!!");
    }
    await Student.findByIdAndUpdate(_id, { isBlocked: true }, { new: true });

    res.status(200).send(" Blocked user is success ! ");
  } catch (e) {
    res.status(500).send("Server Error");
  }
};
const unBlockUser = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("ID is not correct!!");
    }
    await Student.findByIdAndUpdate(_id, { isBlocked: false }, { new: true });
    res.status(200).send(" UnBlocked user is success ! ");
  } catch (e) {
    res.status(500).send("Server Error");
  }
};
const changePassword = async (req, res) => {
  const { id: _id } = req.user;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("ID is not correct!!");
  }
  const { OldPassword, NewPassword } = req.body;
  const user = await Teacher.findById(_id);
  const isPassword = await bcryptjs.compare(OldPassword, user.password);
  if (!isPassword) {
    return res
      .status(404)
      .send(" Old Password is not correct, please write your correct password");
  }
  user.password = NewPassword;
  user.save();
  res.status(200).send("PASSWORD is changed !!");
};

const loginOut = async (req, res) => {
  try {
    req.user.tokens = [];
    res
      .clearCookie("access_token", { sameSite: "none", secure: true })
      .status(200)
      .send("login out is success.");
  } catch (e) {
    res.status(500).send("Server Error");
  }
};

const forgetPassword = async (req, res) => {
  try {
    const user = req.body;
    const dubUser = await Teacher.findOne({ email: user.email });
    if (!dubUser) {
      return res
        .status(404)
        .send(" email is not exist , please write a correct email ");
    }
    const SEKRET = process.env.SECRET;
    const resettoken = crypto.randomBytes(32).toString("hex");
    dubUser.passwordResetToken = crypto
      .createHmac("sha256", SEKRET)
      .update(resettoken)
      .digest("hex");

    const token = dubUser.passwordResetToken;
    await dubUser.save();
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      service: process.env.SERVICE,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });
    const Message = `${process.env.BASE_URL}/app/teacher/resetpassword/${token}`;

    async function main() {
      const info = await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: dubUser.email,
        subject: " RESET PASSWORD ",
        html: `<P>hello ${dubUser.email} go to link ${Message} for "RESET PASSWORD" </P> <P> expires after 6 h !!</P>`,
      });

      console.log("Message sent");
    }

    main().catch(console.error);

    res.status(200).send(" check your email to reset password !");
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.params.token;
    const user = await Teacher.findOne({
      passwordResetToken: token,
    });
    if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();
    console.log(user);
    res.status(200).send("PASSWORD IS CHANGED !!");
  } catch (e) {
    res.status(500).send("Server Error");
  }
};

const getAllStudent = async (req, res) => {
  try {
    const allDataTeacher = await Teacher.findById(req.user._id);
    const allDataStudent = await Student.find({ teachers: allDataTeacher._id });

    res.status(200).json(allDataStudent);
  } catch (e) {
    res.status(500).send("Server Error");
  }
};

const getStudent = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const student = await Student.findById(_id);
    if (!student) {
      return res.status(404).send(" id not exist ! ");
    }

    res.status(200).send(user);
  } catch (e) {
    res.status(500).send("Server Error");
  }
};

const unAccessUser = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("ID is not correct!!");
    }
    await Teacher.findByIdAndUpdate(_id, { access: false }, { new: true }).then(
      (unaccess) => {
        unaccess.save();
      }
    );

    res.status(200).send(" unaccess user is success ! ");
  } catch (e) {
    res.status(500).send("Server Error");
  }
};

const accessUser = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("ID is not correct!!");
    }
    await Student.findByIdAndUpdate(_id, { access: true }, { new: true }).then(
      (access) => {
        access.save();
      }
    );

    res.status(200).send(" access user is success ! ");
  } catch (e) {
    res.status(500).send("Server Error");
  }
};

module.exports = {
  Register,
  Login,
  getUser,
  getAllUser,
  editData,
  deleteOneData,
  deleteAllData,
  blockUser,
  unBlockUser,
  changePassword,
  loginOut,
  VerifiyEmail,
  forgetPassword,
  resetPassword,
  getAllStudent,
  getStudent,
  accessUser,
  unAccessUser,
  deleteCourseThatinStudent,
};
