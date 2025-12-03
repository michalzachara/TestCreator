import { Router } from 'express'

import { verifyToken } from '../middleware/auth.js'
import { deleteQuestion, editQuestion, uploadQuestionImage } from '../controllers/question.controller.js'
import { upload } from '../middleware/upload.js'

const router = Router()

router.put('/:id', verifyToken, editQuestion)
router.delete('/:id', verifyToken, deleteQuestion)
router.post('/upload', verifyToken, upload.single('image'), uploadQuestionImage)

export default router
