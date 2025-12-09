import { useNavigate } from 'react-router-dom'

export default function Landing() {
	const navigate = useNavigate()
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 text-white flex items-center">
			<div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				<div className="space-y-6">
					<p className="text-sm uppercase tracking-[0.3em] text-slate-200">Platforma testów</p>
					<h1 className="text-3xl sm:text-5xl font-bold leading-tight">
						Projektuj, udostępniaj i oceniaj testy w jednym miejscu.
					</h1>
					<p className="text-lg text-slate-200/90 leading-relaxed">
						Intuicyjne tworzenie pytań, eleganckie raporty i pełna kontrola nad przebiegiem testów.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
						<button
							className="px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold shadow-lg hover:-translate-y-0.5 transition"
							onClick={() => navigate('/login')}>
							Zaloguj się
						</button>
						<button
							className="px-6 py-3 rounded-xl border border-white/50 text-white font-semibold hover:bg-white/10 transition"
							onClick={() => navigate('/login/register')}>
							Utwórz konto
						</button>
					</div>
				</div>
				<div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl backdrop-blur-lg">
					<div className="grid grid-cols-2 gap-4 text-center">
						<div className="p-4 rounded-2xl bg-white/10">
							<p className="text-3xl font-bold">4.8/5</p>
							<p className="text-sm text-slate-200">Satysfakcja użytkowników</p>
						</div>
						<div className="p-4 rounded-2xl bg-white/10">
							<p className="text-3xl font-bold">+1k</p>
							<p className="text-sm text-slate-200">Przesłanych odpowiedzi</p>
						</div>
						<div className="p-4 rounded-2xl bg-white/10">
							<p className="text-3xl font-bold">Sekundy</p>
							<p className="text-sm text-slate-200">do startu testu</p>
						</div>
						<div className="p-4 rounded-2xl bg-white/10">
							<p className="text-3xl font-bold">24/7</p>
							<p className="text-sm text-slate-200">Dostęp online</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
