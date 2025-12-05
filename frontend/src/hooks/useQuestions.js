import { useState, useCallback } from 'react'

export function useQuestions(initialQuestions = [], addToast) {
	const [questions, setQuestions] = useState(initialQuestions)

	const handleQuestionAdded = useCallback(
		newQuestion => {
			setQuestions(prev => [...prev, newQuestion])
			addToast('Pytanie zostało dodane', 'success')
		},
		[addToast]
	)

	const handleQuestionUpdated = useCallback(
		updatedQuestion => {
			setQuestions(prev => prev.map(q => (q._id === updatedQuestion._id ? updatedQuestion : q)))
			addToast('Pytanie zostało zaktualizowane', 'success')
		},
		[addToast]
	)

	const handleQuestionDeleted = useCallback(
		questionId => {
			setQuestions(prev => prev.filter(q => q._id !== questionId))
			addToast('Pytanie zostało usunięte', 'success')
		},
		[addToast]
	)

	const setQuestionsFromTest = useCallback(testQuestions => {
		setQuestions(testQuestions || [])
	}, [])

	return {
		questions,
		handleQuestionAdded,
		handleQuestionUpdated,
		handleQuestionDeleted,
		setQuestionsFromTest,
	}
}
