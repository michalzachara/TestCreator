import { useState, useCallback } from 'react'

export function usePublicTestForm() {
	const [formData, setFormData] = useState({
		name: '',
		surname: '',
		classType: '',
		answers: [],
	})

	const initializeAnswers = useCallback(questions => {
		const initialAnswers = questions.map(q => ({
			questionId: q._id,
			selectedAnswers: [],
		}))
		setFormData(prev => ({ ...prev, answers: initialAnswers }))
	}, [])

	const updatePersonalData = useCallback((name, value) => {
		setFormData(prev => ({ ...prev, [name]: value }))
	}, [])

	const updateAnswers = useCallback(newAnswers => {
		setFormData(prev => ({ ...prev, answers: newAnswers }))
	}, [])

	return {
		formData,
		initializeAnswers,
		updatePersonalData,
		updateAnswers,
		setFormData,
	}
}

