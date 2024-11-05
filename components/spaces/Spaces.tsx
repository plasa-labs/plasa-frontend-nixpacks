'use client'

// Internal component imports
import SpacesSpaceCard from './SpacesSpaceCard'
import SpacesLoadingState from './SpacesLoadingState'
import { SpacesErrorState, SpacesNoDataState } from './SpacesErrorState'

// Hooks and types
import { usePlasaData } from '@/app/hooks/usePlasaData'
import { SpacePreview } from '@/lib/onchain/types/interfaces'

/**
 * SpacesPage Component
 * 
 * Renders a list of space previews fetched from the Plasa platform.
 * Handles loading, error, and no-data states appropriately.
 * 
 * @returns {JSX.Element} The rendered spaces page component
 */
export default function SpacesPage(): JSX.Element {
	const { data: plasaData, isLoading, isError } = usePlasaData()

	if (isLoading) return <SpacesLoadingState />
	if (isError) return <SpacesErrorState />
	if (!plasaData) return <SpacesNoDataState />

	return (
		<div className="main-container">
			<h2 className="text-2xl font-bold mb-6">Espacios</h2>
			{plasaData.spaces.map((space: SpacePreview) => (
				<SpacesSpaceCard key={space.data.contractAddress} space={space} />
			))}
			<p className="text-center mt-8 text-sm text-gray-600">
				Contáctanos para crear tu propio espacio!
			</p>
		</div>
	)
}
