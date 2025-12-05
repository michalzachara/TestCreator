import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export function useLoginSubmission(addToast, resetForm) {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const submitLogin = useCallback(
		async (email, password) => {
			setError('')
			setLoading(true)

			try {
				const response = await fetch('/api/auth/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email, password }),
				})

				const data = await response.json()

				if (!response.ok) {
					const errorMsg = data.message || 'Błąd logowania'
					setError(errorMsg)
					addToast(errorMsg, 'error')
					return { success: false }
				}

				localStorage.setItem('token', data.token)
				localStorage.setItem('user', JSON.stringify(data.user))

				addToast(data.message || 'Zalogowano pomyślnie', 'success')
				resetForm()
				navigate('/')
				return { success: true, data }
			} catch (err) {
				const errorMsg = 'Błąd sieci. Spróbuj ponownie.'
				setError(errorMsg)
				addToast(errorMsg, 'error')
				console.error('Błąd logowania:', err)
				return { success: false }
			} finally {
				setLoading(false)
			}
		},
		[addToast, resetForm, navigate]
	)

	return {
		loading,
		error,
		submitLogin,
		setError,
	}
}

