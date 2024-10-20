'use client'

import Link from 'next/link'
import { useReadContract, useAccount } from 'wagmi'

import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { PlasaView } from '@/app/ts-interfaces/types/plasa'
import { SpacePreview } from '@/app/ts-interfaces/types/spaces'

import { contractsGetPlasa } from '@/app/onchain/contracts'

const SpaceCard = ({ space }: { space: SpacePreview }) => (
	<Card className="mb-4">
		<div className="flex items-center p-4">
			<div className="w-16 h-16 mr-4 overflow-hidden rounded-lg">
				<img src={space.data.imageUrl} alt={space.data.name} className="w-full h-full object-cover" />
			</div>
			<div className="flex-grow">
				<CardTitle className="mb-2">{space.data.name}</CardTitle>
				<p className="text-sm text-gray-600">{space.data.description}</p>
			</div>
			<Link href={`/space/${space.data.contractAddress}`} passHref>
				<Button>Entrar</Button>
			</Link>
		</div>
	</Card>
)

const SkeletonCard = () => (
	<Card className="mb-4">
		<div className="flex items-center p-4">
			<Skeleton className="w-16 h-16 mr-4 rounded-lg" />
			<div className="flex-grow">
				<Skeleton className="h-6 w-3/4 mb-2" />
				<Skeleton className="h-4 w-full" />
			</div>
			<Skeleton className="h-10 w-20" />
		</div>
	</Card>
)

const SkeletonHeader = () => (
	<header className="flex justify-between items-center p-4 border-b">
		<div className="flex items-center">
			<Skeleton className="w-6 h-6 mr-2" />
			<Skeleton className="w-20 h-8" />
		</div>
		<div className="flex items-center">
			<Skeleton className="w-20 h-6 mr-2" />
			<Skeleton className="w-10 h-10 rounded-full" />
		</div>
	</header>
)

export default function Component() {
	const { address: userAddress } = useAccount()

	const contract = contractsGetPlasa(userAddress)

	const { data: plasaData, isLoading, isError } = useReadContract(contract)

	if (isLoading) {
		return (
			<div className="min-h-screen">
				<SkeletonHeader />
				<main className="container mx-auto px-4 py-8">
					<Skeleton className="h-8 w-40 mb-6" />
					{[1, 2, 3].map((i) => (
						<SkeletonCard key={i} />
					))}
					<Skeleton className="h-4 w-64 mx-auto mt-8" />
				</main>
			</div>
		)
	}

	if (isError) {
		return <div>Error: Failed to load data. Please try again later.</div>
	}

	if (!plasaData) {
		return <div>Error: No data available. Please check your connection and try again.</div>
	}

	const typedPlasaData = plasaData as unknown as PlasaView

	return (
		<div className="min-h-screen">
			<main className="container mx-auto px-4 py-8">
				<h2 className="text-2xl font-bold mb-6">Espacios</h2>
				{typedPlasaData.spaces.map((space: SpacePreview) => (
					<SpaceCard key={space.data.contractAddress} space={space} />
				))}
				<p className="text-center mt-8 text-sm text-gray-600">
					Contáctanos para crear tu propio espacio!
				</p>
			</main>
		</div>
	)
}
