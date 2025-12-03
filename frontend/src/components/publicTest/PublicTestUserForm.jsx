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
							fieldErrors.name ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
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
							fieldErrors.surname ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
						}`}
						placeholder="Wpisz swoje nazwisko"
					/>
					{fieldErrors.surname && <p className="text-sm text-red-600 underline mt-1">Pole wymagane</p>}
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Klasa</label>
					<input
						type="text"
						name="classType"
						value={formData.classType}
						onChange={onChange}
						className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
							fieldErrors.classType ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
						}`}
						placeholder="Np. klasa 3A"
					/>
					{fieldErrors.classType && <p className="text-sm text-red-600 underline mt-1">Pole wymagane</p>}
				</div>
			</div>
		</div>
	)
}
