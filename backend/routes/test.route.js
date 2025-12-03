import { Router } from 'express'

import { verifyToken } from '../middleware/auth.js'
import { allTests, createTest, deleteTest, editTest, getTest, duplicateTest } from '../controllers/test.controller.js'
import { addQuestion } from '../controllers/question.controller.js'
import { getAnswers } from '../controllers/answer.controller.js'

const router = Router()

router.post('/new', verifyToken, createTest)
router.get('/all', verifyToken, allTests)
router.get('/:id', verifyToken, getTest)
router.put('/:id', verifyToken, editTest)
router.delete('/:id', verifyToken, deleteTest)
router.post('/:id/duplicate', verifyToken, duplicateTest)

//add question
router.post('/:id/question/add', verifyToken, addQuestion)

//get answer
router.get('/:id/answers', verifyToken, getAnswers)

export default router
