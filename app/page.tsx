'use client'

import { SpaceCard } from '@/app/components/spaces/SpaceCard'
import { LoadingState } from '@/app/components/spaces/LoadingState'
import { ErrorState, NoDataState } from '@/app/components/spaces/ErrorState'
import { usePlasaData } from '@/app/hooks/usePlasaData'
import { SpacePreview } from '@/lib/onchain/types/spaces'

interface PlasaData {
	spaces: SpacePreview[]
}

export default function SpacesPage() {
	const { data: plasaData, isLoading, isError } = usePlasaData()

	if (isLoading) return <LoadingState />
	if (isError) return <ErrorState />
	if (!plasaData) return <NoDataState />

	return (
		<div className="main-container">
			<h2 className="text-2xl font-bold mb-6">Espacios</h2>
			{plasaData.spaces.map((space: SpacePreview) => (
				<SpaceCard key={space.data.contractAddress} space={space} />
			))}
			<p className="text-center mt-8 text-sm text-gray-600">
				Contáctanos para crear tu propio espacio!
			</p>
		</div>
	)
}
