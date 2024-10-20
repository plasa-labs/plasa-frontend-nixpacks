'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useReadContract } from 'wagmi'

import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

import { PlasaView } from '@/app/ts-interfaces/types/plasa'
import { SpacePreview } from '@/app/ts-interfaces/types/spaces'
import { plasaABI } from '@/app/plasaABI'

const Header = ({ username }: { username: string }) => (
	<header className="flex justify-between items-center p-4 border-b">
		<div className="flex items-center">
			<Menu className="mr-2 h-6 w-6" />
			<h1 className="text-xl font-bold">Plasa</h1>
		</div>
		<div className="flex items-center">
			<span className="mr-2">{username}</span>
			<Avatar>
				<AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${username}`} alt={username} />
				<AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
			</Avatar>
		</div>
	</header>
)

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
	const [userAddress, setUserAddress] = useState<`0x${string}` | undefined>()

	// Fetch user's address (you might want to use Wagmi's useAccount hook here)
	useEffect(() => {
		// This is a placeholder. Replace with actual logic to get the user's address.
		setUserAddress('0x1234567890123456789012345678901234567890')
	}, [])

	const { data: plasaData, isLoading, isError } = useReadContract({
		address: '0xB118054847d57c1183B8362AA6fE1196c21aff39',
		abi: plasaABI,
		functionName: 'getPlasaView',
		args: [userAddress! as `0x${string}`],
		chainId: 84532, // Base Sepolia chain ID
	})

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

	if (isError || !plasaData) {
		return <div>Error loading data</div>
	}

	const typedPlasaData = plasaData as unknown as PlasaView

	return (
		<div className="min-h-screen">
			<Header username={typedPlasaData.user.username} />
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
