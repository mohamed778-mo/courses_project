const multer = require('multer')
const path = require('path')

const Istorage = multer.diskStorage({

    destination:(req,file,cb)=>{
        cb(null,"uploads")
    },
    
    filename:(req,file,cb)=>{
        var extention = path.extname(file.originalname)
        cb(null, Date.now() + extention)
    }
})

const Iupload=multer({
    storage:Istorage,
    limits:{fileSize: 1024 * 1024 * 1024},
    fileFilter:(req,file,cb)=>{
        fileType = file.mimetype == "image/png" || file.mimetype ==  "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "video/mp4"||file.mimetype == 'video/gif'||file.mimetype === 'video/webm'||file.mimetype === 'video/ogg' || file.mimetype === "application/pdf"
            
        if(fileType){
            cb(null,true)
        }
        else{
            cb(null,false)
        }
        }



})


module.exports = Iupload ; 




