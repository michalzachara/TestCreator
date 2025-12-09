const CLASSES_BY_GROUP = [
	['bbk', 'be', 'bm', 'bwa', 'bwb', 'bwc', 'bwd', 'TAw', 'TB', 'TE', 'TGF', 'TH', 'TiP', 'TMe'],
	['bbk', 'bme', 'bwa', 'bwb', 'THE', 'TiP', 'TMe'],
	['bb', 'be', 'bmk', 'bwa', 'bwb', 'bwc', 'bwd', 'TB', 'TE', 'TGF', 'TH', 'TI', 'TMe', 'TP'],
	['TBG', 'TE', 'TGF', 'TH', 'TI', 'TMe', 'TP'],
	['TBG', 'TE', 'TGs', 'TI', 'TMe', 'TP'],
]

export default function PublicTestUserForm({ formData, fieldErrors, onChange }) {
	return (
		<div
			className={`bg-white rounded-lg shadow-md p-6 sm:p-8 mb-6 border-b-2 ${
				fieldErrors.name || fieldErrors.surname || fieldErrors.classType
					? 'border-b-4 border-red-500'
					: 'border-transparent'
			}`}>
			<h2 className="text-2xl font-bold text-gray-800 mb-4">Twoje dane</h2>
			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Imię</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={onChange}
						className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
							fieldErrors.name ? 'border-red-400 focus:ring-red-500' : 'border-neutral-300 focus:ring-neutral-800'
						}`}
						placeholder="Wpisz swoje imię"
					/>
					{fieldErrors.name && <p className="text-sm text-red-600 underline mt-1">Pole wymagane</p>}
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Nazwisko</label>
					<input
						type="text"
						name="surname"
						value={formData.surname}
						onChange={onChange}
						className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
							fieldErrors.surname ? 'border-red-400 focus:ring-red-500' : 'border-neutral-300 focus:ring-neutral-800'
						}`}
						placeholder="Wpisz swoje nazwisko"
					/>
					{fieldErrors.surname && <p className="text-sm text-red-600 underline mt-1">Pole wymagane</p>}
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Klasa</label>
					<div className="relative">
						<select
							name="classType"
							value={formData.classType}
							onChange={onChange}
							className={`w-full px-4 py-2 pr-10 border-2 rounded-lg focus:outline-none appearance-none bg-white text-gray-800 font-medium cursor-pointer transition-all duration-200 shadow-sm ${
								fieldErrors.classType
									? 'border-red-400 focus:ring-red-500 hover:border-red-500 focus:shadow-red-200'
									: formData.classType
									? 'border-neutral-900 focus:ring-neutral-800 hover:border-neutral-900 focus:shadow-neutral-200'
									: 'border-neutral-300 focus:ring-neutral-800 hover:border-neutral-500 focus:shadow-neutral-200'
							} ${!formData.classType ? 'text-gray-400' : 'text-gray-800'}`}>
							<option value="" disabled className="text-gray-400 italic">
								Wybierz klasę
							</option>
							{CLASSES_BY_GROUP.map((group, groupIndex) => (
								<optgroup key={groupIndex} label={`Klasy ${groupIndex + 1}`}>
									{group.map(className => (
										<option
											key={className}
											value={groupIndex + 1 + className}
											className="text-gray-800 font-medium py-2">
											{groupIndex + 1}
											{className}
										</option>
									))}
								</optgroup>
							))}
						</select>
						<div
							className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 ${
								fieldErrors.classType ? 'text-red-500' : formData.classType ? 'text-neutral-900' : 'text-gray-500'
							}`}>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>
					{fieldErrors.classType && <p className="text-sm text-red-600 underline mt-1">Pole wymagane</p>}
				</div>
			</div>
		</div>
	)
}
