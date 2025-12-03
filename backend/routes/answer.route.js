import { Router } from 'express'
import { verifyToken } from '../middleware/auth.js'
import { getAnswerDetail } from '../controllers/answer.controller.js'

const router = Router()

router.get('/:answerId', verifyToken, getAnswerDetail)

export default router


