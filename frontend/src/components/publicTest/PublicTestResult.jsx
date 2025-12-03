import Navbar from '../../widgets/Navbar'

export default function PublicTestResult({ result }) {
	if (!result) return null

	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar hideAuthActions />
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
				<div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">Test zakończony!</h1>
						<div
							className={`bg-linear-to-r f rounded-lg p-6 mb-4 ${
								result.percentage < 50 ? 'bg-red-50 to-red-100' : 'bg-green-50 to-green-100'
							}`}>
							<p className={`text-5xl font-bold mb-2 ${result.percentage < 50 ? 'text-red-600' : 'text-green-600'}`}>
								{result.percentage.toFixed(1)}%
							</p>
							<p className="text-2xl font-semibold text-gray-700">
								{result.score} / {result.maxScore}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
