const express = require ("express")
const router = express.Router()
const storage = require("../middleware/multer_upload")

const {add_question,get_Questions,get_Question ,delete_question,edit_question}=require("../controllers/question_bank_control")

router.post("/add_question",storage.any(),add_question)
router.get("/get_questions",get_Questions)
router.get("/get_question/:question_id",get_Question)

router.put("/edit_question/:question_id",storage.any(),edit_question)
router.delete("/delete_question/:question_id",delete_question)

module.exports = router
