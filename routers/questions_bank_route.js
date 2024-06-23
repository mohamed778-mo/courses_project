const express = require ("express")
const router = express.Router()
const storage = require("../middleware/multer_upload")

const {add_question,get_Questions ,delete_question,edit_question}=require("../controllers/question_bank_control")

router.post("/add_question",storage.single('file'),add_question)
router.get("/get_questions",get_Questions)
router.put("/edit_question/:id",storage.single('file'),edit_question)
router.delete("/delete_question/:id",delete_question)

module.exports = router