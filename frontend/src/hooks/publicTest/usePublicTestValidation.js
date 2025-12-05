import { useState, useCallback } from 'react'

export function usePublicTestValidation() {
	const [fieldErrors, setFieldErrors] = useState({
		name: false,
		surname: false,
		classType: false,
	})
	const [questionErrors, setQuestionErrors] = useState([])

	const clearFieldError = useCallback(fieldName => {
		setFieldErrors(prev => ({ ...prev, [fieldName]: false }))
	}, [])

	const validateForm = useCallback((formData, test) => {
		const personalErrors = {
			name: !formData.name.trim(),
			surname: !formData.surname.trim(),
			classType: !formData.classType.trim(),
		}
		setFieldErrors(personalErrors)

		const hasPersonalErrors = Object.values(personalErrors).some(Boolean)

		const unanswered = test.questions
			.filter(q => {
				const record = formData.answers.find(a => a.questionId === q._id)
				return !record || record.selectedAnswers.length === 0
			})
			.map(q => q._id)
		setQuestionErrors(unanswered)

		return {
			hasErrors: hasPersonalErrors || unanswered.length > 0,
			personalErrors,
			unanswered,
		}
	}, [])

	return {
		fieldErrors,
		questionErrors,
		clearFieldError,
		validateForm,
		setQuestionErrors,
	}
}

