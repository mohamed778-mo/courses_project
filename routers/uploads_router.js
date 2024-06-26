const express = require('express');
const router = express.Router();
const storage = require("../middleware/multer_upload")

const { upload_pdf,get_pdf,delete_pdf,get_pdfs} = require('../controllers/uploads_control');
const { adminAuth }=require("../middleware/auth")


router.post('/teacher/upload_pdf/:course_id',adminAuth, storage.single('file'), upload_pdf);
router.get('/both/get_pdf/:pdf_id', get_pdf); //teacher and student //
router.delete('/delete_pdf/:pdf_id', delete_pdf);
router.get('/both/get_pdfs/:course_id', get_pdfs); //teacher and student //





module.exports = router;
