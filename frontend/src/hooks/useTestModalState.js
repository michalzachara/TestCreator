import { useState, useCallback } from 'react'

export function useTestModalState() {
	const [showModal, setShowModal] = useState(false)
	const [editingTest, setEditingTest] = useState(null)

	const openModal = useCallback(() => {
		setEditingTest(null)
		setShowModal(true)
	}, [])

	const openModalForEdit = useCallback(test => {
		setEditingTest(test)
		setShowModal(true)
	}, [])

	const closeModal = useCallback(() => {
		setShowModal(false)
		setEditingTest(null)
	}, [])

	const handleTestCreated = useCallback(
		newTest => {
			setShowModal(false)
			setEditingTest(null)
			return newTest
		},
		[]
	)

	const handleTestUpdated = useCallback(
		updatedTest => {
			setShowModal(false)
			setEditingTest(null)
			return updatedTest
		},
		[]
	)

	return {
		showModal,
		editingTest,
		openModal,
		openModalForEdit,
		closeModal,
		handleTestCreated,
		handleTestUpdated,
	}
}

