import { useState, useCallback } from 'react'

export function useRegisterForm() {
	const [formData, setFormData] = useState({
		name: '',
		surname: '',
		email: '',
		password: '',
		confirmPassword: '',
	})

	const handleChange = useCallback((name, value) => {
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}, [])

	const resetForm = useCallback(() => {
		setFormData({
			name: '',
			surname: '',
			email: '',
			password: '',
			confirmPassword: '',
		})
	}, [])

	return {
		formData,
		handleChange,
		resetForm,
	}
}

