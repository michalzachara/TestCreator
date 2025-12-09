import { useState, useCallback } from 'react'

export function useQuestionSubmission(
	editingQuestion,
	testId,
	content,
	answers,
	mediaType,
	imageFile,
	imagePreview,
	youtubeUrl,
	addToast,
	onQuestionAdded,
	onQuestionUpdated,
	onClose,
	resetForm,
	resetAnswers,
	resetMedia,
	isSingleChoice = false
) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const uploadImage = useCallback(async file => {
		try {
			const token = localStorage.getItem('token')
			const formData = new FormData()
			formData.append('image', file)

			const uploadRes = await fetch('/api/question/upload', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			})

			if (!uploadRes.ok) {
				const uploadData = await uploadRes.json()
				const msg = uploadData.message || 'Błąd podczas przesyłania obrazu'
				setError(msg)
				addToast(msg, 'error')
				return null
			}

			const uploadData = await uploadRes.json()
			if (uploadData.ok && uploadData.url) {
				return {
					type: 'image',
					url: uploadData.url,
					content: '',
				}
			}
			return null
		} catch (err) {
			const msg = 'Błąd sieci podczas przesyłania obrazu.'
			setError(msg)
			addToast(msg, 'error')
			console.error(err)
			return null
		}
	}, [addToast])

	const prepareMedia = useCallback(async () => {
		let media = []

		if (mediaType === 'image') {
			if (imageFile) {
				const uploaded = await uploadImage(imageFile)
				if (uploaded) {
					media = [uploaded]
				} else {
					return null
				}
			} else if (imagePreview && editingQuestion && editingQuestion.media) {
				const existing = editingQuestion.media.find(m => m.type === 'image' && m.url)
				if (existing) {
					media = [
						{
							type: 'image',
							url: existing.url,
							content: existing.content || '',
						},
					]
				}
			}
		} else if (mediaType === 'youtube') {
			const trimmed = youtubeUrl.trim()
			if (trimmed) {
				media = [
					{
						type: 'youtube',
						url: trimmed,
						content: '',
					},
				]
			}
		}

		return media
	}, [mediaType, imageFile, imagePreview, youtubeUrl, editingQuestion, uploadImage])

	const validateForm = useCallback(() => {
		if (!content.trim()) {
			const msg = 'Pytanie jest wymagane'
			setError(msg)
			addToast(msg, 'warning')
			return false
		}

		const filledAnswers = answers.filter(
			a => (a.type === 'text' && a.text.trim()) || (a.type === 'image' && a.text && a.text.trim())
		)
		if (filledAnswers.length < 2) {
			const msg = 'Minimum 2 odpowiedzi wymagane!'
			setError(msg)
			addToast(msg, 'warning')
			return false
		}

		const correctCount = filledAnswers.filter(a => a.isCorrect).length
		if (correctCount === 0) {
			const msg = 'Minimum jedna odpowiedź musi być oznaczona jako poprawna!'
			setError(msg)
			addToast(msg, 'warning')
			return false
		}

		if (isSingleChoice && correctCount > 1) {
			const msg = 'W trybie jednokrotnym tylko jedna odpowiedź może być poprawna.'
			setError(msg)
			addToast(msg, 'warning')
			return false
		}

		return true
	}, [content, answers, addToast, isSingleChoice])

	const submitQuestion = useCallback(
		async () => {
			setError('')

			if (!validateForm()) {
				return { success: false }
			}

			setLoading(true)

			try {
				const media = await prepareMedia()
				if (media === null && mediaType === 'image' && imageFile) {
					return { success: false }
				}

				const token = localStorage.getItem('token')
				const method = editingQuestion ? 'PUT' : 'POST'
				const url = editingQuestion ? `/api/question/${editingQuestion._id}` : `/api/test/${testId}/question/add`

				const filledAnswers = answers.filter(
					a => (a.type === 'text' && a.text.trim()) || (a.type === 'image' && a.text && a.text.trim())
				)

				const formattedAnswers = filledAnswers.map(a => ({
					type: a.type || 'text',
					content: a.text,
				}))

				const correctIndexes = filledAnswers
					.map((a, idx) => (a.isCorrect ? idx : -1))
					.filter(idx => idx !== -1)
					.slice(0, isSingleChoice ? 1 : undefined)

				const response = await fetch(url, {
					method,
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						title: content,
						media: media || [],
						answers: formattedAnswers,
						correctAnswers: correctIndexes,
					}),
				})

				if (!response.ok) {
					const data = await response.json()
					const errorMsg = data.message || 'Błąd podczas zapisywania pytania'
					setError(errorMsg)
					addToast(errorMsg, 'error')
					return { success: false }
				}

				const data = await response.json()

				if (editingQuestion) {
					onQuestionUpdated(data)
				} else {
					onQuestionAdded(data)
				}

				resetForm()
				resetAnswers()
				resetMedia()
				onClose()

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
		[
			validateForm,
			prepareMedia,
			mediaType,
			imageFile,
			editingQuestion,
			testId,
			content,
			answers,
			addToast,
			onQuestionAdded,
			onQuestionUpdated,
			onClose,
			resetForm,
			resetAnswers,
			resetMedia,
			isSingleChoice,
		]
	)

	return {
		loading,
		error,
		submitQuestion,
		setError,
		uploadImage,
	}
}

