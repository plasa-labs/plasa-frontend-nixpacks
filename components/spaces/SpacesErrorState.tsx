/**
 * SpacesErrorState components
 * Contains reusable error state displays for the Spaces feature
 */

/**
 * Displays a generic error message when data loading fails
 */
export function SpacesErrorState() {
	return (
		<div className="text-center p-4">
			<p className="text-red-500">Error: Failed to load data. Please try again later.</p>
		</div>
	)
}

/**
 * Displays a message when no data is available
 */
export function SpacesNoDataState() {
	return (
		<div className="text-center p-4">
			<p className="text-gray-500">Error: No data available. Please check your connection and try again.</p>
		</div>
	)
}
