import Test from '../models/test.model.js'
import Question from '../models/question.model.js'
import fs from 'fs'
import path from 'path'

const isImageUsedInOtherQuestions = async (imageUrl, excludeQuestionId, userId) => {
	if (!imageUrl) return false

	try {
		const otherQuestions = await Question.find({
			_id: { $ne: excludeQuestionId },
		}).populate('testId')

		for (const question of otherQuestions) {
			if (question.testId && question.testId.userId.toString() !== userId) {
				continue
			}

			if (question.media && question.media.length) {
				for (const media of question.media) {
					if (media.type === 'image' && media.url === imageUrl) {
						return true
					}
				}
			}

			if (question.answers && question.answers.length) {
				for (const answer of question.answers) {
					if (answer.type === 'image' && answer.content === imageUrl) {
						return true
					}
				}
			}
		}

		return false
	} catch (err) {
		console.error('Error checking if image is used:', err)
		return true
	}
}

const deleteFileByUrl = url => {
	if (!url) return
	try {
		const relative = url.replace(/^\/+/, '')
		const filePath = path.join(process.cwd(), relative)
		fs.unlink(filePath, err => {
			if (err && err.code !== 'ENOENT') {
				console.error('Error removing file:', filePath, err)
			}
		})
	} catch (err) {
		console.error('Error resolving file path for deletion:', url, err)
	}
}

export const addQuestion = async (req, res) => {
	const { id } = req.params
	const { title, media = [], answers, correctAnswers, order = 0 } = req.body

	try {
		const test = await Test.findById(id)

		if (!test) {
			return res.status(404).json({ message: 'Test not found' })
		}

		if (test.userId.toString() !== req.user.id) {
			return res.status(403).json({ message: 'Access denied' })
		}

		if (!title?.trim() || !answers?.length || !correctAnswers?.length) {
			return res.status(400).json({ message: 'Missing required fields' })
		}

		const invalidIndexes = correctAnswers.filter(i => i < 0 || i >= answers.length)
		if (invalidIndexes.length > 0) {
			return res.status(400).json({
				message: `Invalid answer indexes: ${invalidIndexes.join(', ')}`,
			})
		}

		if (test.singleChoice && correctAnswers.length !== 1) {
			return res.status(400).json({
				message: 'Ten test pozwala na oznaczenie dokładnie jednej poprawnej odpowiedzi.',
			})
		}

		const newQuestion = await Question.create({
			testId: test._id,
			title,
			media,
			answers,
			correctAnswers,
			order,
		})

		return res.status(201).json(newQuestion)
	} catch (err) {
		console.error('Error adding question:', err)

		if (err.name === 'ValidationError') {
			return res.status(400).json({
				message: Object.values(err.errors)
					.map(e => e.message)
					.join(', '),
			})
		}

		return res.status(500).json({ message: 'Failed to add question' })
	}
}

export const editQuestion = async (req, res) => {
	const { id } = req.params
	const { title, media = [], answers, correctAnswers, order = 0 } = req.body

	try {
		if (!id.match(/^[0-9a-fA-F]{24}$/)) {
			return res.status(400).json({ message: 'Invalid question ID format' })
		}

		const question = await Question.findById(id)
		if (!question) {
			return res.status(404).json({ message: 'Question not found' })
		}

		const test = await Test.findById(question.testId)
		if (!test) {
			return res.status(404).json({ message: 'Associated test not found' })
		}

		if (test.userId.toString() !== req.user.id) {
			return res.status(403).json({ message: 'Access denied' })
		}

		if (!title?.trim() || !answers?.length || !correctAnswers?.length) {
			return res.status(400).json({ message: 'Missing required fields' })
		}

		const invalidIndexes = correctAnswers.filter(i => i < 0 || i >= answers.length)
		if (invalidIndexes.length > 0) {
			return res.status(400).json({
				message: `Invalid answer indexes: ${invalidIndexes.join(', ')}`,
			})
		}

		if (test.singleChoice && correctAnswers.length !== 1) {
			return res.status(400).json({
				message: 'Ten test pozwala na oznaczenie dokładnie jednej poprawnej odpowiedzi.',
			})
		}

		const oldImageUrls = []
		if (question.media && question.media.length) {
			question.media.filter(m => m.type === 'image' && m.url).forEach(m => oldImageUrls.push(m.url))
		}
		if (question.answers && question.answers.length) {
			question.answers.filter(a => a.type === 'image' && a.content).forEach(a => oldImageUrls.push(a.content))
		}

		const newImageUrls = []
		if (media && media.length) {
			media.filter(m => m.type === 'image' && m.url).forEach(m => newImageUrls.push(m.url))
		}
		if (answers && answers.length) {
			answers.filter(a => a.type === 'image' && a.content).forEach(a => newImageUrls.push(a.content))
		}

		const toDelete = oldImageUrls.filter(url => !newImageUrls.includes(url))

		for (const imageUrl of toDelete) {
			const isUsed = await isImageUsedInOtherQuestions(imageUrl, id, req.user.id)
			if (!isUsed) {
				deleteFileByUrl(imageUrl)
				console.log(`Usunięto plik: ${imageUrl}`)
			} else {
				console.log(`Plik ${imageUrl} jest używany w innym pytaniu, nie usuwam`)
			}
		}

		question.title = title
		question.media = media
		question.answers = answers
		question.correctAnswers = correctAnswers
		question.order = order

		const updatedQuestion = await question.save()

		res.status(200).json(updatedQuestion)
	} catch (err) {
		console.error('Error editing question:', err)
		res.status(500).json({ message: 'Failed to edit question' })
	}
}

export const deleteQuestion = async (req, res) => {
	const { id } = req.params

	try {
		const question = await Question.findById(id)

		if (!question) {
			return res.status(404).json({ message: 'Question not found' })
		}

		const test = await Test.findById(question.testId)
		if (!test) {
			return res.status(404).json({ message: 'Associated test not found' })
		}

		if (test.userId.toString() !== req.user.id) {
			return res.status(403).json({ message: 'Access denied' })
		}

		const imageUrls = []
		if (question.media && question.media.length) {
			question.media.filter(m => m.type === 'image' && m.url).forEach(m => imageUrls.push(m.url))
		}
		if (question.answers && question.answers.length) {
			question.answers.filter(a => a.type === 'image' && a.content).forEach(a => imageUrls.push(a.content))
		}

		await Question.findByIdAndDelete(id)

		for (const imageUrl of imageUrls) {
			const isUsed = await isImageUsedInOtherQuestions(imageUrl, id, req.user.id)
			if (!isUsed) {
				deleteFileByUrl(imageUrl)
				console.log(`Usunięto plik: ${imageUrl}`)
			} else {
				console.log(`Plik ${imageUrl} jest używany w innym pytaniu, nie usuwam`)
			}
		}

		res.status(200).json({ message: 'Question deleted successfully' })
	} catch (err) {
		console.error('Error deleting question:', err)
		res.status(500).json({ message: 'Failed to delete question' })
	}
}

export const uploadQuestionImage = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ ok: false, message: 'Brak pliku obrazu' })
		}

		const userId = req.user?.id
		const relativePath = `/uploads/${userId || 'anonymous'}/${req.file.filename}`

		return res.status(200).json({
			ok: true,
			url: relativePath,
		})
	} catch (err) {
		console.error('Error uploading question image:', err)
		return res.status(500).json({ ok: false, message: 'Błąd podczas przesyłania obrazu' })
	}
}
