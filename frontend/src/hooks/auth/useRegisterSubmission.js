import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export function useRegisterSubmission(addToast, resetForm) {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const validateForm = useCallback(
		formData => {
			if (!formData.name || !formData.surname || !formData.email || !formData.password) {
				const msg = 'Wszystkie pola są wymagane'
				setError(msg)
				addToast(msg, 'warning')
				return false
			}

			if (formData.password !== formData.confirmPassword) {
				const msg = 'Hasła nie pasują'
				setError(msg)
				addToast(msg, 'warning')
				return false
			}

			if (formData.password.length < 6) {
				const msg = 'Hasło musi mieć co najmniej 6 znaków'
				setError(msg)
				addToast(msg, 'warning')
				return false
			}

			return true
		},
		[addToast]
	)

	const submitRegister = useCallback(
		async formData => {
			setError('')

			if (!validateForm(formData)) {
				return { success: false }
			}

			setLoading(true)

			try {
				const response = await fetch('/api/auth/register', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: formData.name,
						surname: formData.surname,
						email: formData.email,
						password: formData.password,
					}),
				})

				const data = await response.json()

				if (!response.ok) {
					const errorMsg = data.message || 'Błąd rejestracji'
					setError(errorMsg)
					addToast(errorMsg, 'error')
					return { success: false }
				}

				addToast(data.message || 'Rejestracja zakończona', 'success')
				resetForm()
				navigate('/login')
				return { success: true, data }
			} catch (err) {
				const errorMsg = 'Błąd sieci. Spróbuj ponownie.'
				setError(errorMsg)
				addToast(errorMsg, 'error')
				console.error('Błąd rejestracji:', err)
				return { success: false }
			} finally {
				setLoading(false)
			}
		},
		[validateForm, addToast, resetForm, navigate]
	)

	return {
		loading,
		error,
		submitRegister,
		setError,
	}
}

