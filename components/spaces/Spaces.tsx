'use client'

import { SpacesSpaceCard } from './SpacesSpaceCard'
import { SpacesLoadingState } from './SpacesLoadingState'
import { SpacesErrorState, SpacesNoDataState } from './SpacesErrorState'

import { usePlasaData } from '@/app/hooks/usePlasaData'
import { SpacePreview } from '@/lib/onchain/types/spaces'

export default function SpacesPage() {
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
