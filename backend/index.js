import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

import { connectToDb } from './config/db.js'

import userRoutes from './routes/user.route.js'
import testRoutes from './routes/test.route.js'
import questionRoutes from './routes/question.route.js'
import publicRoutes from './routes/public.route.js'
import answerRoutes from './routes/answer.route.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/api/auth', userRoutes)
app.use('/api/test', testRoutes)
app.use('/api/question', questionRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/answer', answerRoutes)

const PORT = process.env.PORT || 3000

const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, '../frontend/dist')))


app.use((req, res, next) => {
	if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
		return next()
	}

	return res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
})

app.listen(PORT, () => {
	console.log('server dziala')
	connectToDb()
	console.log(`http://localhost:${PORT}/`)
})
