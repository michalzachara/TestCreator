import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export function useTestDetail(testId, addToast) {
	const navigate = useNavigate()
	const [test, setTest] = useState(null)
	const [loading, setLoading] = useState(true)

	const fetchTestDetail = useCallback(async () => {
		setLoading(true)
		try {
			const token = localStorage.getItem('token')
			const response = await fetch(`/api/test/${testId}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				const data = await response.json()
				addToast(data.message || 'Błąd podczas wczytywania testu', 'error')
				navigate('/panel')
				return
			}

			const data = await response.json()
			setTest(data)
		} catch (error) {
			addToast('Błąd sieci. Spróbuj ponownie.', 'error')
			console.error('Błąd podczas wczytywania testu:', error)
			navigate('/panel')
		} finally {
			setLoading(false)
		}
	}, [testId, addToast, navigate])

	useEffect(() => {
		fetchTestDetail()
	}, [fetchTestDetail])

	const updateTest = useCallback(updatedTest => {
		setTest(updatedTest)
	}, [])

	return {
		test,
		loading,
		refetch: fetchTestDetail,
		updateTest,
	}
}
