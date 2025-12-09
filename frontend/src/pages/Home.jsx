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
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
					<div>
						<p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">Panel nauczyciela</p>
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1">Moje testy</h1>
						<p className="text-slate-600 mt-1">Twórz, duplikuj i zarządzaj testami w jednym miejscu.</p>
					</div>
					<button
						onClick={openModal}
						className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition duration-200 shadow-md text-sm sm:text-base">
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
						<p className="text-slate-600 text-base sm:text-lg">Wczytywanie testów...</p>
					</div>
				) : tests.length === 0 ? (
					<div className="text-center py-12 sm:py-16 card rounded-2xl p-8">
						<p className="text-slate-700 text-base sm:text-lg mb-4">Brak testów. Dodaj swój pierwszy.</p>
						<button
							onClick={openModal}
							className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm">
							Utwórz test
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch">
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
