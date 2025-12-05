import { useState, useCallback } from 'react'

export function usePublicTestSubmission(link, addToast) {
	const [submitted, setSubmitted] = useState(false)
	const [result, setResult] = useState(null)

	const storageKey = `public_test_${link}_submitted`

	// Inicjalizacja alreadySubmitted z localStorage przy użyciu funkcji inicjalizującej
	const [alreadySubmitted, setAlreadySubmitted] = useState(() => {
		try {
			const stored = localStorage.getItem(storageKey)
			return !!stored
		} catch {
			return false
		}
	})

	const submitTest = useCallback(
		async formData => {
			if (alreadySubmitted) {
				addToast('Ten test został już wysłany z tego urządzenia.', 'warning')
				return { success: false }
			}

			try {
				const response = await fetch('/api/public/result', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						uniqueLink: link,
						name: formData.name,
						surname: formData.surname,
						classType: formData.classType,
						answers: formData.answers,
					}),
				})

				if (!response.ok) {
					const data = await response.json()
					addToast(data.message || 'Failed to submit test', 'error')
					return { success: false }
				}

				const data = await response.json()
				if (data.ok) {
					setResult(data.result)
					setSubmitted(true)
					try {
						localStorage.setItem(storageKey, '1')
						setAlreadySubmitted(true)
					} catch {
						// jeśli localStorage nie działa, po prostu pomijamy blokadę
					}
					addToast('Test submitted successfully!', 'success')
					return { success: true, result: data.result }
				} else {
					addToast(data.message || 'Failed to submit test', 'error')
					return { success: false }
				}
			} catch (err) {
				addToast('Network error. Please try again.', 'error')
				console.error('Error submitting test:', err)
				return { success: false }
			}
		},
		[link, addToast, alreadySubmitted, storageKey]
	)

	return {
		submitted,
		result,
		alreadySubmitted,
		submitTest,
	}
}
