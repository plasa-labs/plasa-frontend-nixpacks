export function SpacesErrorState() {
	return (
		<div className="text-center p-4">
			<p className="text-red-500">Error: Failed to load data. Please try again later.</p>
		</div>
	)
}

export function SpacesNoDataState() {
	return (
		<div className="text-center p-4">
			<p className="text-gray-500">Error: No data available. Please check your connection and try again.</p>
		</div>
	)
}
