import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTestDetail } from '../hooks/useTestDetail'
import { useTestAnswers } from '../hooks/useTestAnswers'

const buckets = [
	{ label: '0-20%', min: 0, max: 20 },
	{ label: '21-40%', min: 21, max: 40 },
	{ label: '41-60%', min: 41, max: 60 },
	{ label: '61-80%', min: 61, max: 80 },
	{ label: '81-100%', min: 81, max: 100 },
]

const arraysEqual = (a, b) => {
	if (!Array.isArray(a) || !Array.isArray(b)) return false
	if (a.length !== b.length) return false
	const sa = [...a].sort((x, y) => x - y)
	const sb = [...b].sort((x, y) => x - y)
	for (let i = 0; i < sa.length; i++) {
		if (sa[i] !== sb[i]) return false
	}
	return true
}

const percentFromScore = ans => {
	if (!ans || ans.maxScore === 0) return 0
	return (ans.score / ans.maxScore) * 100
}

const getYouTubeEmbedUrl = url => {
	if (!url) return ''
	try {
		const u = new URL(url)
		let videoId = ''
		if (u.hostname.includes('youtu.be')) {
			videoId = u.pathname.slice(1)
		} else if (u.searchParams.get('v')) {
			videoId = u.searchParams.get('v')
		}
		if (!videoId) return url
		return `https://www.youtube.com/embed/${videoId}`
	} catch {
		return url
	}
}

export default function TestResults({ addToast }) {
	const { testId } = useParams()
	const navigate = useNavigate()

	const { test, loading: loadingTest } = useTestDetail(testId, addToast)
	const { answers, loadingAnswers, refetch } = useTestAnswers(testId, addToast)

	const handlePrint = () => {
		// Użyj dialogu drukowania przeglądarki, aby zapisać stronę jako PDF
		window.print()
	}

	const stats = useMemo(() => {
		if (!answers.length) {
			return {
				avgPercent: 0,
				avgScore: 0,
				passRate: 0,
				bestPercent: 0,
				worstPercent: 0,
			}
		}

		const percents = answers.map(percentFromScore)
		const scores = answers.map(a => a.score || 0)
		const maxScores = answers.map(a => a.maxScore || 0)

		const avgPercent = percents.reduce((s, v) => s + v, 0) / answers.length
		const avgScore = scores.reduce((s, v) => s + v, 0) / answers.length
		const passRate = (percents.filter(p => p >= 50).length / answers.length) * 100
		const bestPercent = Math.max(...percents)
		const worstPercent = Math.min(...percents)

		return { avgPercent, avgScore, passRate, bestPercent, worstPercent }
	}, [answers])

	const distribution = useMemo(() => {
		const counts = buckets.map(bucket => {
			const count = answers.filter(ans => {
				const p = percentFromScore(ans)
				return p >= bucket.min && p <= bucket.max
			}).length
			return { ...bucket, count }
		})
		const max = Math.max(1, ...counts.map(c => c.count))
		return { counts, max }
	}, [answers])

	const questionStats = useMemo(() => {
		if (!test?.questions?.length || !answers.length) return []

		const totalSubmissions = answers.length

		return test.questions.map(q => {
			let correct = 0
			let attempted = 0
			const optionCounts = Array(q.answers?.length || 0).fill(0)

			answers.forEach(ans => {
				const match = ans.answers?.find(a => String(a.questionId) === String(q._id))
				if (match) {
					const selectedRaw = Array.isArray(match.selectedAnswers) ? match.selectedAnswers : []
					const selected = test.singleChoice ? selectedRaw.slice(0, 1) : selectedRaw

					if (selected.length > 0) {
						attempted++
					}

					selected.forEach(idx => {
						if (idx >= 0 && idx < optionCounts.length) {
							optionCounts[idx] += 1
						}
					})

					if (arraysEqual(selected, q.correctAnswers || [])) {
						correct++
					}
				}
			})

			const percent = attempted ? (correct / attempted) * 100 : 0

			return {
				id: q._id,
				title: q.title,
				percent,
				optionCounts,
				totalSubmissions,
				answers: q.answers || [],
				correctAnswers: q.correctAnswers || [],
				media: q.media || [],
				attempted,
			}
		})
	}, [test, answers])

	if (loadingTest) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<p className="text-gray-600 text-lg">Wczytywanie testu...</p>
			</div>
		)
	}

	if (!test) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<p className="text-gray-600 text-lg">Test nie znaleziony</p>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
					<button
						onClick={() => navigate(`/test/${testId}`)}
						className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-neutral-300 hover:border-neutral-500 text-neutral-800 rounded-lg text-sm font-semibold transition">
						<span>←</span> Powrót do testu
					</button>
					<button
						onClick={refetch}
						className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-neutral-300 hover:border-neutral-500 rounded-lg text-sm font-semibold text-neutral-800 transition">
						⟳ Odśwież wyniki
					</button>
					<button
						onClick={handlePrint}
						disabled={loadingAnswers}
						className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-neutral-300 hover:border-neutral-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg text-sm font-semibold text-neutral-800 transition">
						🖨 Drukuj PDF
					</button>
				</div>

				<div className="bg-white rounded-xl shadow-md p-5 sm:p-7 mb-6 border border-gray-100">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<div>
							<p className="text-xs uppercase tracking-wide text-gray-500">Wyniki ogólne</p>
							<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{test.title}</h1>
							{test.description && <p className="text-gray-600 mt-1">{test.description}</p>}
						</div>
						<div className="flex gap-2 flex-wrap">
							<span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-900 border border-neutral-200">
								Odpowiedzi: {answers.length}
							</span>
							{test.singleChoice && (
								<span className="px-3 py-1 rounded-full text-xs font-semibold bg-black text-white border border-black">
									Jednokrotny wybór
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					<StatCard
						title="Średni wynik"
						value={`${stats.avgPercent.toFixed(1)}%`}
						sub={`${stats.avgScore.toFixed(1)} pkt`}
					/>
					<StatCard title="Zdawalność (>=50%)" value={`${stats.passRate.toFixed(1)}%`} />
					<StatCard
						title="Najlepszy / Najsłabszy"
						value={`${stats.bestPercent.toFixed(1)}%`}
						sub={`min ${stats.worstPercent.toFixed(1)}%`}
					/>
				</div>

				<div className="bg-white rounded-xl shadow-md p-5 sm:p-7 mb-6 border border-gray-100">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rozkład wyników</h2>
						<span className="text-xs text-gray-500">({answers.length} odpowiedzi)</span>
					</div>
					{loadingAnswers ? (
						<p className="text-gray-600 text-sm">Wczytywanie wyników...</p>
					) : answers.length === 0 ? (
						<p className="text-gray-500 text-sm italic">Brak odpowiedzi dla tego testu.</p>
					) : (
						<div className="space-y-3">
							{distribution.counts.map(bucket => {
								const width = `${(bucket.count / distribution.max) * 100}%`
								return (
									<div key={bucket.label} className="flex items-center gap-3">
										<span className="w-20 text-xs font-semibold text-gray-700">{bucket.label}</span>
										<div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
											<div className="h-full bg-linear-to-r from-neutral-400 to-neutral-900" style={{ width }} />
										</div>
										<span className="text-xs text-gray-600 min-w-[48px] text-right">{bucket.count} os.</span>
									</div>
								)
							})}
						</div>
					)}
				</div>

				<div className="bg-white rounded-xl shadow-md p-5 sm:p-7 border border-gray-100">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl sm:text-2xl font-bold text-gray-900">Skuteczność pytań</h2>
						<span className="text-xs text-gray-500">Odsetek poprawnych odpowiedzi</span>
					</div>
					{loadingAnswers ? (
						<p className="text-gray-600 text-sm">Wczytywanie...</p>
					) : questionStats.length === 0 ? (
						<p className="text-gray-500 text-sm italic">Brak danych do wyświetlenia.</p>
					) : (
						<div className="space-y-4">
							{questionStats.map(q => (
								<div key={q.id}>
									<p className="text-sm font-semibold text-gray-800 mb-1">{q.title}</p>
									<div className="flex items-center gap-3">
										<div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
											<div
												className={`h-full rounded-full ${
																q.percent >= 70
																	? 'bg-neutral-900'
																	: q.percent >= 40
																	? 'bg-neutral-600'
																	: 'bg-neutral-400'
												}`}
												style={{ width: `${q.percent}%` }}
											/>
										</div>
										<span className="text-xs font-semibold text-gray-700 w-14 text-right">{q.percent.toFixed(1)}%</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="bg-white rounded-xl shadow-md p-5 sm:p-7 border border-gray-100 mt-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rozkład odpowiedzi na pytania</h2>
						<span className="text-xs text-gray-500">Jak często wybierano poszczególne opcje</span>
					</div>
					{loadingAnswers ? (
						<p className="text-gray-600 text-sm">Wczytywanie...</p>
					) : questionStats.length === 0 ? (
						<p className="text-gray-500 text-sm italic">Brak danych do wyświetlenia.</p>
					) : (
						<div className="space-y-6">
							{questionStats.map(q => (
								<div key={q.id} className="border rounded-lg p-4 bg-gray-50/80">
									<p className="text-sm font-semibold text-gray-800 mb-3">{q.title}</p>

									{(() => {
										const img = q.media.find(m => m.type === 'image' && m.url)
										const yt = q.media.find(m => m.type === 'youtube' && m.url)
										if (img) {
											return (
												<div className="mb-3">
													<img
														src={img.url}
														alt="Obraz do pytania"
														className="w-full max-h-64 object-contain rounded border border-gray-200 bg-white"
													/>
												</div>
											)
										}
										if (yt) {
											return (
												<div className="mb-3 aspect-video w-full rounded border border-gray-200 overflow-hidden bg-black">
													<iframe
														title={`Wideo do pytania`}
														src={getYouTubeEmbedUrl(yt.url)}
														className="w-full h-full"
														allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
														allowFullScreen
													/>
												</div>
											)
										}
										return null
									})()}

									<div className="space-y-2">
										{q.answers.map((ans, idx) => {
											const count = q.optionCounts[idx] || 0
											const percentBase = q.totalSubmissions || 0
											const percent = percentBase ? (count / percentBase) * 100 : 0
											const barWidth = Math.min(100, percent)
											const label = String.fromCharCode(65 + idx)
											const isImage = ans.type === 'image'
											const isCorrect = q.correctAnswers.includes(idx)
											const barClass = isCorrect
												? 'bg-linear-to-r from-neutral-600 to-neutral-900'
												: 'bg-linear-to-r from-slate-200 to-slate-400'
											const textClass = isCorrect ? 'text-neutral-900' : 'text-gray-800'
											return (
												<div key={idx}>
													<div className="flex items-center justify-between text-xs text-gray-600 mb-1">
														<span className={`font-semibold ${textClass}`}>
															{label}. {isImage ? 'Obraz' : ans.content?.slice(0, 60) || '—'}
															{isCorrect && <span className="ml-2 text-[11px] font-bold text-neutral-900">POPRAWNA</span>}
														</span>
														<span className="text-gray-700 font-semibold">
															{percent.toFixed(1)}% ({count})
														</span>
													</div>
													<div className="h-3 bg-white rounded-full overflow-hidden border border-gray-200">
														<div className={`h-full ${barClass}`} style={{ width: `${barWidth}%` }} />
													</div>
													{isImage && ans.content && (
														<div className="mt-2">
															<img
																src={ans.content}
																alt={`Odpowiedź ${label}`}
																className="max-h-32 rounded border border-gray-200 bg-white object-contain"
															/>
														</div>
													)}
												</div>
											)
										})}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

function StatCard({ title, value, sub, accent = 'blue' }) {
	const accentClasses = 'bg-neutral-100 text-neutral-900 border-neutral-200'

	return (
		<div className={`rounded-xl border ${accentClasses} p-4 sm:p-5 shadow-sm`}>
			<p className="text-xs uppercase tracking-wide font-semibold text-gray-500">{title}</p>
			<p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
			{sub && <p className="text-sm text-gray-600 mt-1">{sub}</p>}
		</div>
	)
}
