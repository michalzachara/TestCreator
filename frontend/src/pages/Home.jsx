import CreateTestModal from '../components/testComponent/CreateTestModal'
import TestCard from '../components/testComponent/TestCard'
import { useTests } from '../hooks/useTests'
import { useTestsManagement } from '../hooks/useTestsManagement'
import { useTestModalState } from '../hooks/useTestModalState'

export default function Home({ addToast }) {
	const { tests, loading, setTests } = useTests(addToast)
	const {
		handleTestCreated: onTestCreated,
		handleTestUpdated: onTestUpdated,
		handleTestDeleted,
		handleTestDuplicated,
	} = useTestsManagement(tests, setTests)
	const {
		showModal,
		editingTest,
		openModal,
		openModalForEdit,
		closeModal,
		handleTestCreated: modalHandleCreated,
		handleTestUpdated: modalHandleUpdated,
	} = useTestModalState()

	const handleTestCreated = newTest => {
		const processedTest = modalHandleCreated(newTest)
		onTestCreated(processedTest)
	}

	const handleTestUpdated = updatedTest => {
		const processedTest = modalHandleUpdated(updatedTest)
		onTestUpdated(processedTest)
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">Moje testy</h1>
					<button
						onClick={openModal}
						className="w-full sm:w-auto bg-black hover:bg-neutral-800 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-full transition duration-200 shadow-md text-sm sm:text-base">
						+ Utwórz test
					</button>
				</div>
				{/* Modal */}
				{showModal && (
					<CreateTestModal
						isOpen={showModal}
						onClose={closeModal}
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
								onEdit={openModalForEdit}
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
