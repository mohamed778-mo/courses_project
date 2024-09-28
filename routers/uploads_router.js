const express = require('express');
const router = express.Router();
const storage = require("../middleware/multer_upload")

const { upload_pdf,get_pdf,delete_pdf,get_pdfs, get_imgs, get_img, upload_images} = require('../controllers/uploads_control');
const { adminAuth }=require("../middleware/auth")


router.post('/teacher/upload_pdf/:course_id',adminAuth,storage.any(), upload_pdf);
router.get('/both/get_pdf/:pdf_id', get_pdf); //teacher and student //
router.delete('/teacher/delete_pdf/:pdf_id', delete_pdf);
router.get('/both/get_pdfs/:course_id', get_pdfs); //teacher and student //

router.post('/teacher/upload_images/:course_id',adminAuth, upload.array('files', 50), upload_images);

router.get('/both/get_img/:img_id', get_img); //teacher and student //

router.get('/both/get_imgs/:course_id', get_imgs); //teacher and student //



module.exports = router;
