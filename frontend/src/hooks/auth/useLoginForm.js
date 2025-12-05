import { useState, useCallback } from 'react'

export function useLoginForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const resetForm = useCallback(() => {
		setEmail('')
		setPassword('')
	}, [])

	return {
		email,
		setEmail,
		password,
		setPassword,
		resetForm,
	}
}

