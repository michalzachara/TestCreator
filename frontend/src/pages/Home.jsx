import { useState, useEffect, useCallback } from 'react'
import CreateTestModal from '../components/testComponent/CreateTestModal'
import TestCard from '../components/testComponent/TestCard'

export default function Home({ addToast }) {
	const [showModal, setShowModal] = useState(false)
	const [tests, setTests] = useState([])
	const [loading, setLoading] = useState(false)
	const [editingTest, setEditingTest] = useState(null)

	const fetchTests = useCallback(async () => {
		setLoading(true)
		try {
			const token = localStorage.getItem('token')
			const response = await fetch('/api/test/all', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (response.ok) {
				const data = await response.json()
				setTests(data)
			} else {
				const data = await response.json()
				addToast(data.message || 'Błąd podczas wczytywania testów', 'error')
			}
		} catch (error) {
			addToast('Błąd sieci. Spróbuj ponownie.', 'error')
			console.error('Błąd podczas wczytywania testów:', error)
		} finally {
			setLoading(false)
		}
	}, [addToast])

	useEffect(() => {
		fetchTests()
	}, [fetchTests])

	const handleTestCreated = newTest => {
		setTests([newTest, ...tests])
		setShowModal(false)
		setEditingTest(null)
	}

	const handleTestUpdated = updatedTest => {
		setTests(tests.map(t => (t._id === updatedTest._id ? updatedTest : t)))
		setShowModal(false)
		setEditingTest(null)
	}

	const handleTestDeleted = testId => {
		setTests(tests.filter(t => t._id !== testId))
	}

	const handleTestDuplicated = newTest => {
		setTests([newTest, ...tests])
	}

	const handleEditTest = test => {
		setEditingTest(test)
		setShowModal(true)
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Moje testy</h1>
					<button
						onClick={() => {
							setEditingTest(null)
							setShowModal(true)
						}}
						className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition duration-200 shadow-lg text-sm sm:text-base">
						+ Utwórz test
					</button>
				</div>
				{/* Modal */}
				{showModal && (
					<CreateTestModal
						isOpen={showModal}
						onClose={() => {
							setShowModal(false)
							setEditingTest(null)
						}}
						onTestCreated={handleTestCreated}
						onTestUpdated={handleTestUpdated}
						editingTest={editingTest}
						addToast={addToast}
					/>
				)}{' '}
				{/* Tests Grid */}
				{loading ? (
					<div className="text-center py-12 sm:py-16">
						<p className="text-gray-600 text-base sm:text-lg">Wczytywanie testów...</p>
					</div>
				) : tests.length === 0 ? (
					<div className="text-center py-12 sm:py-16">
						<p className="text-gray-600 text-base sm:text-lg mb-4">Brak testów. Dodaj swoj pierwszy</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6  items-stretch">
						{tests.map(test => (
							<TestCard
								key={test._id}
								test={test}
								onEdit={handleEditTest}
								onDelete={handleTestDeleted}
								onDuplicate={handleTestDuplicated}
								addToast={addToast}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
