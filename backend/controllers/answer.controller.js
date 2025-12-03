import Answer from '../models/answer.model.js'

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

export const getAnswers = async (req, res) => {
	const { id } = req.params

	try {
		const answers = await Answer.find({ testId: id })
			.populate('testId', 'title description uniqueLink')
			.sort({ submittedAt: -1 })

		// Zwracamy zawsze tablicę (może być pusta)
		res.status(200).json(answers)
	} catch (error) {
		console.error('Error fetching answers:', error)
		res.status(500).json({ message: 'Server error while fetching answers.' })
	}
}

export const getAnswerDetail = async (req, res) => {
	const { answerId } = req.params

	try {
		const answer = await Answer.findById(answerId)
			.populate({
				path: 'testId',
				select: 'title description userId',
			})
			.populate({
				path: 'answers.questionId',
				select: 'title answers correctAnswers media',
			})

		if (!answer) {
			return res.status(404).json({ ok: false, message: 'Odpowiedź nie została znaleziona.' })
		}

		// Sprawdzenie, czy zalogowany użytkownik jest właścicielem testu
		if (answer.testId && answer.testId.userId && answer.testId.userId.toString() !== req.user.id) {
			return res.status(403).json({ ok: false, message: 'Brak dostępu do tej odpowiedzi.' })
		}

		const detailedResults = (answer.answers || [])
			.map(entry => {
				const question = entry.questionId
				if (!question) return null

				const selectedAnswers = entry.selectedAnswers || []
				const correctAnswers = question.correctAnswers || []
				const isCorrect = arraysEqual(selectedAnswers, correctAnswers)

				return {
					questionId: question._id,
					title: question.title,
					answers: question.answers || [],
					selectedAnswers,
					correctAnswers,
					isCorrect,
				}
			})
			.filter(Boolean)

		const percentage = answer.maxScore > 0 ? (answer.score / answer.maxScore) * 100 : 0

		return res.status(200).json({
			ok: true,
			answer: {
				_id: answer._id,
				name: answer.name,
				surname: answer.surname,
				classType: answer.classType,
				score: answer.score,
				maxScore: answer.maxScore,
				percentage,
				submittedAt: answer.submittedAt,
				test: answer.testId
					? {
							_id: answer.testId._id,
							title: answer.testId.title,
							description: answer.testId.description,
					  }
					: null,
				detailedResults,
			},
		})
	} catch (error) {
		console.error('Error fetching answer detail:', error)
		res.status(500).json({ ok: false, message: 'Błąd serwera podczas pobierania odpowiedzi.' })
	}
}
