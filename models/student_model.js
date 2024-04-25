const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

var studentSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        unique: false,
        trim: true,

    },
    LastName: {
        type: String,
        required: true,
        unique: false,
        trim: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(valu) {
            if (!validator.isEmail(valu)) {
                throw new Error("Invalid email")
            }
        }

    },
    verified: {
        type: Boolean,
        default: false
    },

    mobile: {
        type: String,
        trim: true,

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            const StrongPassword = new RegExp("^(?=.*[a-z])(?=.*[0-9])")
            if (!StrongPassword.test(value)) {
                throw new Error("Password must contain ' ^(?=.*[a-z])(?=.*[0-9]) ' ")
            }
        }
    },
    UniversityName: {
        type: String,
        trim: true
    },
    CollegesName: {
        type: String,
        trim: true
    },


    level: {
        type: String,
        trim: true,
    },
    departement: {
        type: String,
        trim: true
    },
    tokens: [
        {
            type: String,
            expires: "2d"
        }
    ],
    myCourses: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Courses"
            },
            teacher: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Teacher"
            },
            title: {
                type: String
            },
            price: {
                type: String
            },
            subject: {
                type: String
            },
            collegeName: {
                type: String
            },
            UniversityName: {
                type: String
            },
            level: {
                type: String
            },
            departement: {
                type: String
            },
        }
    ],
    myVideos:
    [{
       _id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        },
        description: { type: String, },
        videoURL: { type: String, },
        CourseName: { type: String, },
        TeacherName: { type: String, }
}]
    ,
    photo: {
        type: String,
    },

    role: {
        type: String,
        enum: ['student']
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    access: {
        type: Boolean,
        default: false
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    teachers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher"
        }
    ],
}
    ,
    {
        timestamps: true
    }

);

studentSchema.pre("save", async function () {
    try {
        const user = this
        if (!user.isModified("password")) {

            return
        }
        user.password = await bcryptjs.hash(user.password, 8)

    }
    catch (error) {
        console.log(error)
    }
})

studentSchema.methods.toJSON = function () {
    const user = this
    const dataToObject = user.toObject()
    delete dataToObject.password
    delete dataToObject.tokens

    return dataToObject
}




module.exports = mongoose.model('Student', studentSchema);