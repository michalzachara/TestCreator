export default function PublicTestHeader({ test }) {
	if (!test) return null

	return (
		<div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-6">
			<h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">{test.title}</h1>
			{test.description && <p className="text-gray-600 text-lg mb-3">{test.description}</p>}
			{test.media &&
				test.media.length > 0 &&
				(() => {
					const img = test.media.find(m => m.type === 'image' && m.url)
					if (!img) return null
					return (
						<div className="mt-2">
							<img
								src={img.url}
								alt="Obraz do testu"
								className="w-full max-h-128 object-contain rounded border border-gray-200 bg-gray-50"
							/>
						</div>
					)
				})()}
		</div>
	)
}
