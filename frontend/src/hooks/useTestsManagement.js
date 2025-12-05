import { useCallback } from 'react'

export function useTestsManagement(tests, setTests) {
	const handleTestCreated = useCallback(
		newTest => {
			setTests([newTest, ...tests])
		},
		[tests, setTests]
	)

	const handleTestUpdated = useCallback(
		updatedTest => {
			setTests(prev => prev.map(t => (t._id === updatedTest._id ? updatedTest : t)))
		},
		[setTests]
	)

	const handleTestDeleted = useCallback(
		testId => {
			setTests(prev => prev.filter(t => t._id !== testId))
		},
		[setTests]
	)

	const handleTestDuplicated = useCallback(
		newTest => {
			setTests(prev => [newTest, ...prev])
		},
		[setTests]
	)

	return {
		handleTestCreated,
		handleTestUpdated,
		handleTestDeleted,
		handleTestDuplicated,
	}
}

