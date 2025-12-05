import { useCallback } from 'react'

export function usePublicTestAnswers(test, formData, updateAnswers, setQuestionErrors) {
	const handleAnswerChange = useCallback(
		(questionIndex, answerIndex, isChecked) => {
			if (!test) return

			const newAnswers = [...formData.answers]
			const question = test.questions[questionIndex]
			const answerIndexInArray = newAnswers.findIndex(a => a.questionId === question._id)

			if (answerIndexInArray !== -1) {
				let selectedAnswers = [...newAnswers[answerIndexInArray].selectedAnswers]

				if (isChecked) {
					if (!selectedAnswers.includes(answerIndex)) {
						selectedAnswers.push(answerIndex)
					}
				} else {
					selectedAnswers = selectedAnswers.filter(idx => idx !== answerIndex)
				}

				newAnswers[answerIndexInArray].selectedAnswers = selectedAnswers.sort((a, b) => a - b)
			}

			updateAnswers(newAnswers)
			setQuestionErrors(prev => prev.filter(id => id !== question._id))
		},
		[test, formData.answers, updateAnswers, setQuestionErrors]
	)

	return {
		handleAnswerChange,
	}
}

