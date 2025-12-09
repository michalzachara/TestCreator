import Test from '../models/test.model.js'
import Question from '../models/question.model.js'
import Answer from '../models/answer.model.js'

import mongoose from 'mongoose'

export const getLink = async (req, res) => {
	const { link } = req.params

	try {
		if (!link || link.length < 10) {
			return res.status(400).json({ ok: false, message: 'Niepoprawny format linku' })
		}

		const test = await Test.findOne({ uniqueLink: link, isActive: true })
			.populate({ path: 'questions', options: { sort: { order: 1 } } })
			.lean()

		if (!test) {
			return res.status(404).json({ ok: false, message: 'Test nie znaleziony lub nieaktywny' })
		}

		if (test.activeFor) {
			const now = new Date()
			const expireAt = new Date(test.activeFor)

			console.log('Checking expiry:', { now, expireAt, activeFor: test.activeFor })

			if (!isNaN(expireAt.getTime()) && now > expireAt) {
				return res.status(410).json({
					ok: false,
					message: 'Link do tego testu wygasł. Skontaktuj się z nauczycielem.',
				})
			}
		}

		const sanitizedQuestions = test.questions.map(question => {
			const { correctAnswers, ...questionWithoutAnswers } = question
			return questionWithoutAnswers
		})

		return res.json({
			ok: true,
			test: {
				_id: test._id,
				title: test.title,
				description: test.description,
				uniqueLink: test.uniqueLink,
				singleChoice: test.singleChoice,
				questions: sanitizedQuestions,
			},
		})
	} catch (err) {
		console.error('Error in getLink:', err)
		return res.status(500).json({ ok: false, message: 'Błąd serwera' })
	}
}

const arraysEqual = (a, b) => {
	if (!Array.isArray(a) || !Array.isArray(b)) return false
	if (a.length !== b.length) return false
	const sortedA = [...a].sort((x, y) => x - y)
	const sortedB = [...b].sort((x, y) => x - y)
	for (let i = 0; i < sortedA.length; i++) {
		if (sortedA[i] !== sortedB[i]) return false
	}
	return true
}

export const getResult = async (req, res) => {
	const { uniqueLink, name, surname, classType, answers } = req.body

	if (!uniqueLink || !name || !surname || !classType || !Array.isArray(answers) || answers.length === 0) {
		return res
			.status(400)
			.json({ ok: false, message: 'Wszystkie pola (link, dane zdającego i odpowiedzi) są wymagane.' })
	}

	try {
		const test = await Test.findOne({ uniqueLink: uniqueLink }).select('_id isActive activeFor')

		if (!test) {
			return res.status(404).json({ ok: false, message: 'Test nie znaleziony dla podanego linku.' })
		}

		if (!test.isActive) {
			return res.status(403).json({ ok: false, message: 'Ten test jest obecnie nieaktywny.' })
		}

		if (test.activeFor) {
			const now = new Date()
			const expireAt = new Date(test.activeFor)

			if (now > expireAt) {
				return res.status(410).json({
					ok: false,
					message: 'Czas na wypełnienie tego testu minął. Odpowiedzi nie zostały zapisane.',
				})
			}
		}

		const testId = test._id

		if (test.singleChoice) {
			const hasMultipleSelections = answers.some(
				entry => Array.isArray(entry.selectedAnswers) && entry.selectedAnswers.length > 1
			)
			if (hasMultipleSelections) {
				return res.status(400).json({
					ok: false,
					message: 'Ten test pozwala na jedną wybraną odpowiedź w każdym pytaniu.',
				})
			}
		}

		const questionIds = answers.map(a => a.questionId)

		const questions = await Question.find({
			_id: { $in: questionIds },
			testId: testId,
		}).select('_id correctAnswers')

		const correctAnswersMap = questions.reduce((map, question) => {
			map[question._id.toString()] = question.correctAnswers
			return map
		}, {})

		let totalScore = 0
		let maxPossibleScore = 0

		const results = answers
			.map(submittedAnswer => {
				const questionId = submittedAnswer.questionId
				const selectedAnswers = Array.isArray(submittedAnswer.selectedAnswers)
					? test.singleChoice
						? submittedAnswer.selectedAnswers.slice(0, 1)
						: submittedAnswer.selectedAnswers
					: []
				const correctAnswers = correctAnswersMap[questionId]

				if (correctAnswers) {
					maxPossibleScore++

					const isCorrect = arraysEqual(selectedAnswers, correctAnswers)

					if (isCorrect) {
						totalScore++
					}

					return {
						questionId,
						selectedAnswers,
						isCorrect,
					}
				}
				return null
			})
			.filter(r => r !== null)

		const newAnswer = new Answer({
			testId: testId,
			name: name,
			surname: surname,
			classType: classType,
		answers: answers.map(a => ({
			questionId: a.questionId,
			selectedAnswers: Array.isArray(a.selectedAnswers)
				? test.singleChoice
					? a.selectedAnswers.slice(0, 1)
					: a.selectedAnswers
				: [],
			})),
			score: totalScore,
			maxScore: maxPossibleScore,
		})

		await newAnswer.save()

		return res.status(200).json({
			ok: true,
			message: 'Wynik został obliczony i zapisany.',
			result: {
				score: totalScore,
				maxScore: maxPossibleScore,
				percentage: maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0,
				detailedResults: results,
			},
			submissionId: newAnswer._id,
		})
	} catch (err) {
		console.error('Error in getResult:', err)
		if (err instanceof mongoose.Error.CastError && err.path === '_id') {
			return res.status(400).json({ ok: false, message: 'Nieprawidłowy format ID pytania.' })
		}
		return res.status(500).json({ ok: false, message: 'Błąd serwera podczas przetwarzania wyników.' })
	}
}
