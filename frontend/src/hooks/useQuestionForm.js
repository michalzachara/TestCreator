import { useState, useCallback } from 'react'

export function useQuestionForm() {
	const [showQuestionForm, setShowQuestionForm] = useState(false)
	const [editingQuestion, setEditingQuestion] = useState(null)

	const openForm = useCallback(() => {
		setEditingQuestion(null)
		setShowQuestionForm(true)
	}, [])

	const openFormForEdit = useCallback(question => {
		setEditingQuestion(question)
		setShowQuestionForm(true)
	}, [])

	const closeForm = useCallback(() => {
		setShowQuestionForm(false)
		setEditingQuestion(null)
	}, [])

	const handleQuestionSubmit = useCallback(() => {
		setShowQuestionForm(false)
		setEditingQuestion(null)
	}, [])

	return {
		showQuestionForm,
		editingQuestion,
		openForm,
		openFormForEdit,
		closeForm,
		handleQuestionSubmit,
	}
}
