export default function TestAnswersSummary({
	answers,
	loadingAnswers,
	answersSortBy,
	setAnswersSortBy,
	answersSearch,
	setAnswersSearch,
	answersPage,
	setAnswersPage,
	onRowClick,
}) {
	return (
		<div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-4">
			<div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="text-xl sm:text-2xl font-bold text-gray-800">Odpowiedzi uczniów</h2>
				{answers.length > 0 && (
					<div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
						<div className="flex items-center gap-2 text-sm flex-1 sm:flex-none">
							<span className="text-gray-600 whitespace-nowrap">Wyszukaj:</span>
							<input
								type="text"
								value={answersSearch}
								onChange={e => {
									setAnswersSearch(e.target.value)
									setAnswersPage(1)
								}}
								placeholder="Imię, nazwisko lub klasa"
								className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800"
							/>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<span className="text-gray-600 whitespace-nowrap">Sortuj według:</span>
							<select
								value={answersSortBy}
								onChange={e => {
									setAnswersSortBy(e.target.value)
									setAnswersPage(1)
								}}
								className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800">
								<option value="submitted_desc">Najnowsze</option>
								<option value="name_asc">Imię A-Z</option>
								<option value="surname_asc">Nazwisko A-Z</option>
								<option value="class_asc">Klasa A-Z</option>
							</select>
						</div>
					</div>
				)}
			</div>

			{loadingAnswers ? (
				<p className="text-gray-600 text-sm">Wczytywanie odpowiedzi...</p>
			) : answers.length === 0 ? (
				<p className="text-gray-500 text-sm italic">Brak odpowiedzi dla tego testu.</p>
			) : (
				<>
					<div className="space-y-3 max-h-96 overflow-y-auto pr-1">
						{(() => {
							const normalizedSearch = answersSearch.trim().toLowerCase()
							const filtered = normalizedSearch
								? answers.filter(ans => {
										const name = `${ans.name || ''} ${ans.surname || ''}`.toLowerCase()
										const cls = (ans.classType || '').toLowerCase()
										return name.includes(normalizedSearch) || cls.includes(normalizedSearch)
								  })
								: answers

							const sorted = [...filtered].sort((a, b) => {
								if (answersSortBy === 'name_asc') {
									return a.name.localeCompare(b.name, 'pl', { sensitivity: 'base' })
								}
								if (answersSortBy === 'surname_asc') {
									return a.surname.localeCompare(b.surname, 'pl', { sensitivity: 'base' })
								}
								if (answersSortBy === 'class_asc') {
									return (a.classType || '').localeCompare(b.classType || '', 'pl', {
										numeric: true,
										sensitivity: 'base',
									})
								}
								
								return new Date(b.submittedAt) - new Date(a.submittedAt)
							})

							const pageSize = 30
							const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
							const currentPage = Math.min(answersPage, totalPages)
							const startIndex = (currentPage - 1) * pageSize
							const pageItems = sorted.slice(startIndex, startIndex + pageSize)

							const items = pageItems.map(ans => {
								const percent = ans.maxScore > 0 ? ((ans.score / ans.maxScore) * 100).toFixed(1) : '0.0'
								const submitted = new Date(ans.submittedAt).toLocaleString('pl-PL', {
									year: 'numeric',
									month: '2-digit',
									day: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
								})

								const isGood = Number(percent) >= 50

								return (
									<div
										key={ans._id}
										onClick={() => onRowClick(ans._id)}
										className="border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center hover:bg-gray-50 cursor-pointer transition">
										<div className="flex-1">
											<p className="font-semibold text-gray-800 text-sm sm:text-base">
												{ans.name} {ans.surname}{' '}
												<span className="text-gray-500 text-xs sm:text-sm">({ans.classType})</span>
											</p>
											<p className="text-xs sm:text-sm text-gray-500 mt-1">Wysłano: {submitted}</p>
										</div>
										<div className="flex flex-col items-end gap-1">
											<span
												className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
													isGood ? 'bg-black text-white' : 'bg-red-100 text-red-700'
												}`}>
												{percent}%
											</span>
											<span className="text-xs text-gray-600">
												{ans.score} / {ans.maxScore} pkt
											</span>
										</div>
									</div>
								)
							})

							return (
								<>
									{items}
									{totalPages > 1 && (
										<div className="flex items-center justify-between pt-2 text-xs sm:text-sm text-gray-600">
											<span>
												Strona {currentPage} z {totalPages} (wyników: {sorted.length})
											</span>
											<div className="flex gap-2">
												<button
													type="button"
													disabled={currentPage === 1}
													onClick={() => setAnswersPage(p => Math.max(1, p - 1))}
													className="px-2 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50">
													Poprzednia
												</button>
												<button
													type="button"
													disabled={currentPage === totalPages}
													onClick={() => setAnswersPage(p => Math.min(totalPages, p + 1))}
													className="px-2 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50">
													Następna
												</button>
											</div>
										</div>
									)}
								</>
							)
						})()}
					</div>
				</>
			)}
		</div>
	)
}
