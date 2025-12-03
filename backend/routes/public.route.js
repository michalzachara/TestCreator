import { Router } from 'express'
import { getLink, getResult } from '../controllers/public.controller.js'

const router = Router()

router.get('/:link', getLink)
router.post('/result', getResult)

export default router
