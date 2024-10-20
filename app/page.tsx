'use client'

import Link from 'next/link'
import { useReadContract, useAccount } from 'wagmi'
import Image from 'next/image'

import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { PlasaView } from '@/lib/onchain/types/plasa'
import { SpacePreview } from '@/lib/onchain/types/spaces'

import { contractsGetPlasa } from '@/lib/onchain/contracts'

const SpaceCard = ({ space }: { space: SpacePreview }) => (
	<Card className="mb-4">
		<div className="flex items-center p-4">
			<div className="w-16 h-16 mr-4 overflow-hidden rounded-lg relative">
				<Image
					src={space.data.imageUrl}
					alt={space.data.name}
					fill
					className="object-cover"
				/>
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

export default function Component() {
	const { address: userAddress } = useAccount()

	const contract = contractsGetPlasa(userAddress)

	const { data: plasaData, isLoading, isError } = useReadContract(contract)

	if (isLoading) {
		return (
			<div className="min-h-screen">
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
