import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export function usePublicTest(link, addToast) {
	const navigate = useNavigate()
	const [test, setTest] = useState(null)
	const [loading, setLoading] = useState(true)

	const fetchTest = useCallback(async () => {
		setLoading(true)
		try {
			const response = await fetch(`/api/public/${link}?t=${Date.now()}`)
			if (!response.ok) {
				const data = await response.json()
				console.log(data)

				addToast(data.message || 'Test not found or inactive', 'error')
				navigate('/')
				return
			}

			const data = await response.json()
			if (data.ok) {
				setTest(data.test)
			} else {
				addToast(data.message || 'Failed to load test', 'error')
				navigate('/')
			}
		} catch (err) {
			addToast('Network error. Please try again.', 'error')
			console.error('Error fetching test:', err)
			navigate('/')
		} finally {
			setLoading(false)
		}
	}, [link, addToast, navigate])

	useEffect(() => {
		fetchTest()
	}, [fetchTest])

	return {
		test,
		loading,
		refetch: fetchTest,
	}
}

