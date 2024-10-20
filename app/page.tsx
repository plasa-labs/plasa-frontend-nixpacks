'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data fetch function
const fetchPlasaData = async () => {
	await new Promise(resolve => setTimeout(resolve, 2000)) // Increased delay for demo purposes
	return {
		user: { username: "alice" },
		spaces: [
			{
				data: {
					contractAddress: "0x1111222233334444555566667777888899990000",
					name: "CryptoNews",
					description: "Latest news and updates in the crypto space",
					imageUrl: "/placeholder.svg?height=64&width=64",
				},
			},
			{
				data: {
					contractAddress: "0x2222333344445555666677778888999900001111",
					name: "DeFi Discussions",
					description: "Explore and discuss decentralized finance topics",
					imageUrl: "/placeholder.svg?height=64&width=64",
				},
			},
		],
	}
}

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

const SpaceCard = ({ space }: { space: any }) => (
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
	const [plasaData, setPlasaData] = useState<any>(null)

	useEffect(() => {
		fetchPlasaData().then(setPlasaData)
	}, [])

	if (!plasaData) {
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

	return (
		<div className="min-h-screen">
			<Header username={plasaData.user.username} />
			<main className="container mx-auto px-4 py-8">
				<h2 className="text-2xl font-bold mb-6">Espacios</h2>
				{plasaData.spaces.map((space: any) => (
					<SpaceCard key={space.data.contractAddress} space={space} />
				))}
				<p className="text-center mt-8 text-sm text-gray-600">
					Contáctanos para crear tu propio espacio!
				</p>
			</main>
		</div>
	)
}