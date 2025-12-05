import { useState, useMemo, useCallback, useEffect } from 'react'

export function useQuestionMedia(editingQuestion) {
	// Oblicz docelowy stan na podstawie editingQuestion
	const computedMediaState = useMemo(() => {
		if (editingQuestion && editingQuestion.media && editingQuestion.media.length > 0) {
			const youtubeMedia = editingQuestion.media.find(m => m.type === 'youtube' && m.url)
			const imageMedia = editingQuestion.media.find(m => m.type === 'image' && m.url)

			if (youtubeMedia) {
				return {
					imageFile: null,
					imagePreview: '',
					mediaType: 'youtube',
					youtubeUrl: youtubeMedia.url || '',
				}
			} else if (imageMedia) {
				return {
					imageFile: null,
					imagePreview: imageMedia.url,
					mediaType: 'image',
					youtubeUrl: '',
				}
			}
		}
		return {
			imageFile: null,
			imagePreview: '',
			mediaType: 'none',
			youtubeUrl: '',
		}
	}, [editingQuestion])

	const [mediaState, setMediaState] = useState(computedMediaState)

	// Aktualizuj stan tylko gdy computedMediaState się zmienia
	useEffect(() => {
		setMediaState(computedMediaState)
	}, [computedMediaState])

	const setYoutubeUrl = useCallback(url => {
		setMediaState(prev => ({ ...prev, youtubeUrl: url }))
	}, [])

	const handleMediaTypeChange = useCallback(value => {
		setMediaState(prev => {
			const newState = { ...prev, mediaType: value }
			if (value !== 'image') {
				newState.imageFile = null
				newState.imagePreview = ''
			}
			if (value !== 'youtube') {
				newState.youtubeUrl = ''
			}
			return newState
		})
	}, [])

	const handleImageFileChange = useCallback(file => {
		if (file) {
			setMediaState(prev => ({
				...prev,
				imageFile: file,
				imagePreview: URL.createObjectURL(file),
			}))
		} else {
			setMediaState(prev => ({
				...prev,
				imageFile: null,
				imagePreview: '',
			}))
		}
	}, [])

	const resetMedia = useCallback(() => {
		setMediaState({
			imageFile: null,
			imagePreview: '',
			mediaType: 'none',
			youtubeUrl: '',
		})
	}, [])

	return {
		imageFile: mediaState.imageFile,
		imagePreview: mediaState.imagePreview,
		mediaType: mediaState.mediaType,
		youtubeUrl: mediaState.youtubeUrl,
		setYoutubeUrl,
		handleMediaTypeChange,
		handleImageFileChange,
		resetMedia,
	}
}
