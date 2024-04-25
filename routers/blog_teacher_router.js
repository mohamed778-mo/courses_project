const express =require("express")
const router = express.Router()

const storage = require("../middleware/multer_upload")
const blogcontroller = require("../controllers/blog_control")
const {adminAuth}=require("../middleware/auth")

router.post('/myprofile',adminAuth,storage.single('file'),blogcontroller.createBlog_2)


module.exports = router;