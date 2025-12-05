import { useState, useMemo, useEffect, useCallback } from 'react'

export function useQuestionForm(editingQuestion) {
	const computedContent = useMemo(() => {
		return editingQuestion ? editingQuestion.title || '' : ''
	}, [editingQuestion])

	const [content, setContent] = useState(computedContent)

	useEffect(() => {
		setContent(computedContent)
	}, [computedContent])

	const resetForm = useCallback(() => {
		setContent('')
	}, [])

	return {
		content,
		setContent,
		resetForm,
	}
}
