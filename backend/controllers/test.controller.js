import Test from '../models/test.model.js'
import Question from '../models/question.model.js'
import Answer from '../models/answer.model.js'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

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

export const createTest = async (req, res) => {
	const { title, description, isActive, date } = req.body
	const userId = req.user.id

	try {
		const uniqueLink = crypto.randomUUID()

		const activeFor = date ? date : null

		const newTest = await Test.create({
			userId,
			title,
			description,
			isActive,
			activeFor,
			uniqueLink,
		})

		return res.status(201).json(newTest)
	} catch (err) {
		console.error('Error creating test:', err)
		return res.status(500).json({ message: 'Failed to create test' })
	}
}

export const allTests = async (req, res) => {
	try {
		const tests = await Test.find({ userId: req.user.id }).sort({ createdAt: -1 })

		return res.status(200).json(tests)
	} catch (err) {
		console.error('Error fetching tests:', err)
		return res.status(500).json({ message: 'Failed to fetch tests' })
	}
}

export const getTest = async (req, res) => {
	const { id } = req.params

	try {
		const test = await Test.findById(id)
			.populate({
				path: 'questions',
				options: { sort: { order: 1 } },
			})
			.select('-questions -isCurrentlyActive')

		if (!test) {
			return res.status(404).json({ message: 'Test not found' })
		}

		if (test.userId.toString() !== req.user.id) {
			return res.status(403).json({ message: 'Access denied' })
		}

		return res.status(200).json(test)
	} catch (err) {
		console.error('Error fetching test:', err)
		return res.status(500).json({ message: 'Failed to fetch test' })
	}
}

export const editTest = async (req, res) => {
	const { id } = req.params
	const { title, description, isActive, date } = req.body

	try {
		const test = await Test.findById(id)

		if (!test) {
			return res.status(404).json({ message: 'Test not found' })
		}

		if (test.userId.toString() !== req.user.id) {
			return res.status(403).json({ message: 'Access denied' })
		}

		if (title !== undefined) test.title = title
		if (description !== undefined) test.description = description
		if (isActive !== undefined) test.isActive = isActive
		if (date !== undefined) {
			test.activeFor = date ? date : null
		}

		const updatedTest = await test.save()

		return res.status(200).json(updatedTest)
	} catch (err) {
		console.error('Error updating test:', err)
		return res.status(500).json({ message: 'Failed to update test' })
	}
}

export const deleteTest = async (req, res) => {
	const { id } = req.params

	try {
		const test = await Test.findById(id)
		if (!test) {
			return res.status(404).json({ message: 'Test not found' })
		}

		if (test.userId.toString() !== req.user.id) {
			return res.status(403).json({ message: 'Access denied' })
		}

		const questions = await Question.find({ testId: id })

		for (const q of questions) {
			const imageUrls = []
			if (q.media && q.media.length) {
				q.media.filter(m => m.type === 'image' && m.url).forEach(m => imageUrls.push(m.url))
			}
			if (q.answers && q.answers.length) {
				q.answers.filter(a => a.type === 'image' && a.content).forEach(a => imageUrls.push(a.content))
			}

			for (const url of imageUrls) {
				const stillUsed = await Question.exists({
					testId: { $ne: id },
					$or: [{ 'media.url': url }, { 'answers.content': url }],
				})

				if (!stillUsed) {
					deleteFileByUrl(url)
				}
			}
		}

		await Question.deleteMany({ testId: id })
		await Answer.deleteMany({ testId: id })
		await Test.findByIdAndDelete(id)

		return res.status(200).json({ message: 'Test and all questions deleted successfully' })
	} catch (err) {
		console.error('Error deleting test:', err)
		return res.status(500).json({ message: 'Failed to delete test' })
	}
}

export const duplicateTest = async (req, res) => {
	const { id } = req.params
	const userId = req.user.id

	try {
		const originalTest = await Test.findById(id).populate({
			path: 'questions',
			options: { sort: { order: 1 } },
		})

		if (!originalTest) {
			return res.status(404).json({ message: 'Test not found' })
		}

		if (originalTest.userId.toString() !== userId) {
			return res.status(403).json({ message: 'Access denied' })
		}

		const baseTitle = originalTest.title.includes(' - Copy(')
			? originalTest.title.split(' - Copy(')[0]
			: originalTest.title

		const existingCopies = await Test.find({
			userId,
			title: new RegExp(`^${baseTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} - Copy\\(\\d+\\)$`),
		})

		let copyNumber = 1
		if (existingCopies.length > 0) {
			const numbers = existingCopies.map(test => {
				const match = test.title.match(/- Copy\((\d+)\)$/)
				return match ? parseInt(match[1]) : 0
			})
			copyNumber = Math.max(...numbers) + 1
		}

		const uniqueLink = crypto.randomUUID()

		const newTest = await Test.create({
			userId,
			title: `${baseTitle} - Copy(${copyNumber})`,
			description: originalTest.description,
			isActive: false,
			activeFor: originalTest.activeFor,
			uniqueLink,
		})

		if (originalTest.questions && originalTest.questions.length > 0) {
			const newQuestions = await Promise.all(
				originalTest.questions.map(question =>
					Question.create({
						testId: newTest._id,
						title: question.title,
						answers: JSON.parse(JSON.stringify(question.answers)),
						correctAnswers: JSON.parse(JSON.stringify(question.correctAnswers)),
						order: question.order,
					})
				)
			)

			await Test.findByIdAndUpdate(newTest._id, {
				questions: newQuestions.map(q => q._id),
			})
		}

		return res.status(201).json(newTest)
	} catch (err) {
		console.error('Error duplicating test:', err)
		return res.status(500).json({ message: 'Failed to duplicate test' })
	}
}
