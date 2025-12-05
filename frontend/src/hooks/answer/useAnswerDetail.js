import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export function useAnswerDetail(answerId, addToast) {
	const navigate = useNavigate()
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)

	const fetchDetail = useCallback(async () => {
		setLoading(true)
		try {
			const token = localStorage.getItem('token')
			const response = await fetch(`/api/answer/${answerId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				const resData = await response.json()
				addToast(resData.message || 'Błąd podczas wczytywania odpowiedzi', 'error')
				navigate(-1)
				return
			}

			const resData = await response.json()
			if (!resData.ok) {
				addToast(resData.message || 'Błąd podczas wczytywania odpowiedzi', 'error')
				navigate(-1)
				return
			}

			setData(resData.answer)
		} catch (err) {
			addToast('Błąd sieci. Spróbuj ponownie.', 'error')
			console.error('Error fetching answer detail:', err)
			navigate(-1)
		} finally {
			setLoading(false)
		}
	}, [answerId, addToast, navigate])

	useEffect(() => {
		fetchDetail()
	}, [fetchDetail])

	return {
		data,
		loading,
		refetch: fetchDetail,
	}
}

