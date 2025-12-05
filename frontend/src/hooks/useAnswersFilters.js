import { useState } from 'react'

export function useAnswersFilters() {
	const [answersSortBy, setAnswersSortBy] = useState('submitted_desc')
	const [answersSearch, setAnswersSearch] = useState('')
	const [answersPage, setAnswersPage] = useState(1)

	return {
		answersSortBy,
		setAnswersSortBy,
		answersSearch,
		setAnswersSearch,
		answersPage,
		setAnswersPage,
	}
}
