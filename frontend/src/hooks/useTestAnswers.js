import { useState, useEffect, useCallback } from 'react'

export function useTestAnswers(testId, addToast) {
	const [answers, setAnswers] = useState([])
	const [loadingAnswers, setLoadingAnswers] = useState(false)

	const fetchAnswers = useCallback(async () => {
		setLoadingAnswers(true)
		try {
			const token = localStorage.getItem('token')
			const response = await fetch(`/api/test/${testId}/answers`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				const data = await response.json()
				addToast(data.message || 'Błąd podczas wczytywania odpowiedzi', 'error')
				return
			}

			const data = await response.json()
			setAnswers(Array.isArray(data) ? data : [])
		} catch (error) {
			addToast('Błąd sieci przy wczytywaniu odpowiedzi. Spróbuj ponownie.', 'error')
			console.error('Błąd podczas wczytywania odpowiedzi:', error)
		} finally {
			setLoadingAnswers(false)
		}
	}, [testId, addToast])

	useEffect(() => {
		fetchAnswers()
	}, [fetchAnswers])

	return {
		answers,
		loadingAnswers,
		refetch: fetchAnswers,
	}
}
