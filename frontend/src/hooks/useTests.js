import { useState, useEffect, useCallback } from 'react'

export function useTests(addToast) {
	const [tests, setTests] = useState([])
	const [loading, setLoading] = useState(false)

	const fetchTests = useCallback(async () => {
		setLoading(true)
		try {
			const token = localStorage.getItem('token')
			const response = await fetch('/api/test/all', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (response.ok) {
				const data = await response.json()
				setTests(data)
			} else {
				const data = await response.json()
				addToast(data.message || 'Błąd podczas wczytywania testów', 'error')
			}
		} catch (error) {
			addToast('Błąd sieci. Spróbuj ponownie.', 'error')
			console.error('Błąd podczas wczytywania testów:', error)
		} finally {
			setLoading(false)
		}
	}, [addToast])

	useEffect(() => {
		fetchTests()
	}, [fetchTests])

	return {
		tests,
		loading,
		setTests,
		refetch: fetchTests,
	}
}

