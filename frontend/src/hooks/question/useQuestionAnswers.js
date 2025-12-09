import { useState, useMemo, useEffect, useCallback } from 'react'

const DEFAULT_ANSWERS = [
	{ text: '', isCorrect: false, type: 'text', imagePreview: '' },
	{ text: '', isCorrect: false, type: 'text', imagePreview: '' },
]

export function useQuestionAnswers(editingQuestion, isOpen, addToast, isSingleChoice = false) {
	const computedAnswers = useMemo(() => {
		if (editingQuestion) {
			const frontendAnswers = editingQuestion.answers.map((ans, idx) => {
				const type = ans.type || 'text'
				const isImage = type === 'image'
				const content = ans.content || ''
				return {
					text: content,
					isCorrect: editingQuestion.correctAnswers && editingQuestion.correctAnswers.includes(idx),
					type,
					imagePreview: isImage && content ? content : '',
				}
			})
			return frontendAnswers.length > 0 ? frontendAnswers : DEFAULT_ANSWERS
		}
		return DEFAULT_ANSWERS
	}, [editingQuestion])

	const [answers, setAnswers] = useState(computedAnswers)

	useEffect(() => {
		setAnswers(computedAnswers)
	}, [computedAnswers])

	const handleAnswerChange = useCallback((index, field, value) => {
		setAnswers(prev => {
			const newAnswers = [...prev]
			if (field === 'isCorrect' && value && isSingleChoice) {
				// ensure only one correct answer
				newAnswers.forEach((a, idx) => {
					newAnswers[idx] = { ...a, isCorrect: idx === index }
				})
			} else {
				newAnswers[index] = { ...newAnswers[index], [field]: value }
			}
			return newAnswers
		})
	}, [isSingleChoice])

	const addAnswer = useCallback(() => {
		setAnswers(prev => [...prev, { text: '', isCorrect: false, type: 'text', imagePreview: '' }])
	}, [])

	const removeAnswer = useCallback(
		index => {
			if (answers.length > 2) {
				setAnswers(prev => prev.filter((_, i) => i !== index))
			} else {
				addToast('Minimum 2 odpowiedzi wymagane!', 'warning')
			}
		},
		[answers.length, addToast]
	)

	const updateAnswer = useCallback((index, updatedAnswer) => {
		setAnswers(prev => {
			const newAnswers = [...prev]
			newAnswers[index] = updatedAnswer
			return newAnswers
		})
	}, [])

	const resetAnswers = useCallback(() => {
		setAnswers(DEFAULT_ANSWERS)
	}, [])

	return {
		answers,
		handleAnswerChange,
		addAnswer,
		removeAnswer,
		updateAnswer,
		resetAnswers,
	}
}
