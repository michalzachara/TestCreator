import { useState, useEffect } from 'react'

export function useTestForm(editingTest, isOpen) {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [isActive, setIsActive] = useState(false)
	const [activeFor, setActiveFor] = useState('')
	const [singleChoice, setSingleChoice] = useState(false)

	useEffect(() => {
		if (editingTest) {
			setTitle(editingTest.title || '')
			setDescription(editingTest.description || '')
			setIsActive(editingTest.isActive || false)
			setSingleChoice(editingTest.singleChoice || false)
			if (editingTest.activeFor) {
				const raw = String(editingTest.activeFor)
				const value = raw.includes('T') ? raw.slice(0, 16) : `${raw}T00:00`
				setActiveFor(value)
			} else {
				setActiveFor('')
			}
		} else {
			setTitle('')
			setDescription('')
			setIsActive(false)
			setSingleChoice(false)
			setActiveFor('')
		}
	}, [editingTest, isOpen])

	const resetForm = () => {
		setTitle('')
		setDescription('')
		setIsActive(false)
		setSingleChoice(false)
		setActiveFor('')
	}

	return {
		title,
		setTitle,
		description,
		setDescription,
		isActive,
		setIsActive,
		activeFor,
		setActiveFor,
		singleChoice,
		setSingleChoice,
		resetForm,
	}
}

