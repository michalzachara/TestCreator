import { useState, useCallback } from 'react'

export function useTestModal(addToast) {
	const [showTestModal, setShowTestModal] = useState(false)

	const openModal = useCallback(() => {
		setShowTestModal(true)
	}, [])

	const closeModal = useCallback(() => {
		setShowTestModal(false)
	}, [])

	const handleTestUpdated = useCallback(
		updatedTest => {
			addToast('Test został zaktualizowany', 'success')
			setShowTestModal(false)
			return updatedTest
		},
		[addToast]
	)

	return {
		showTestModal,
		openModal,
		closeModal,
		handleTestUpdated,
	}
}
