import { useState, useCallback } from 'react'

export function useTestFormSubmission(editingTest, addToast, onTestCreated, onTestUpdated, resetForm) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const submitTest = useCallback(
		async formData => {
			setError('')

			if (!formData.title.trim()) {
				const msg = 'Tytuł jest wymagany'
				setError(msg)
				addToast(msg, 'warning')
				return { success: false }
			}

			setLoading(true)

			try {
				const token = localStorage.getItem('token')
				const method = editingTest ? 'PUT' : 'POST'
				const url = editingTest ? `/api/test/${editingTest._id}` : '/api/test/new'

				const response = await fetch(url, {
					method,
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						title: formData.title,
						description: formData.description,
						isActive: formData.isActive,
						date: formData.activeFor,
					}),
				})

				if (!response.ok) {
					const data = await response.json()
					const errorMsg = data.message || 'Błąd podczas zapisywania testu'
					setError(errorMsg)
					addToast(errorMsg, 'error')
					return { success: false }
				}

				const data = await response.json()

				if (editingTest) {
					addToast(data.message || 'Test zaktualizowany!', 'success')
					onTestUpdated(data)
				} else {
					addToast(data.message || 'Test utworzony!', 'success')
					onTestCreated(data)
				}

				resetForm()
				return { success: true, data }
			} catch (err) {
				const errorMsg = 'Błąd sieci. Spróbuj ponownie.'
				setError(errorMsg)
				addToast(errorMsg, 'error')
				console.error('Error:', err)
				return { success: false }
			} finally {
				setLoading(false)
			}
		},
		[editingTest, addToast, onTestCreated, onTestUpdated, resetForm]
	)

	return {
		loading,
		error,
		submitTest,
		setError,
	}
}

