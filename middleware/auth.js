const jwt = require("jsonwebtoken");
const Student = require("../models/student_model");
const Teacher = require("../models/teacher_model");

const auth = async (req, res, next) => {
  try {
    if (!req?.cookies) {
      return res.status(404).send(" please login !");
    }
    const token = req?.cookies?.access_token?.split(" ")[1];
    if (!token) {
      return res.status(401).send(" please login !");
    }

    const SECRETKEY = process.env.SECRETKEY;

    const result = await jwt.verify(token, SECRETKEY, { complete: true });

    if (!result) {
      return res.status(400).send(" please signup or login !");
    }

    const user_1 = await Student.findById(result.payload.id);
    req.user = user_1;

    next();
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const adminAuth = async (req, res, Next) => {
  try {
    if (!req.headers) {
      return res.status(404).send(" please login !");
    }
    console.log(req.headers?.authorization);
    const token = req?.headers?.authorization.split(" ")[1]
    if (!token) {
      return res.status(401).send(" please login !");
    }

    const SECRETKEY = process.env.SECRETKEY;

    const result = await jwt.verify(token, SECRETKEY, { complete: true });

    if (!result) {
      return res.status(400).send(" please signup or login !");
    }

    const user_1 = await Teacher.findById(result.payload.id);
    req.user = user_1;

    if (!user_1.isAdmin) {
      return res.send(" Available for ADMIN ");
    } else {
      Next();
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
};
module.exports = {
  auth,
  adminAuth,
};
