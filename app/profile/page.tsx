'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Instagram, Loader2, ExternalLink, AlertTriangle } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { UserData, StampSignature } from './return-interfaces'

const PLASA_CONTRACT_ADDRESS = '0xB118054847d57c1183B8362AA6fE1196c21aff39'

// Mock data
const mockPlasaView = {
	user: { username: 'jesse.base.eth' },
	stamps: [
		{ data: { contractAddress: '0x1', name: 'Stamp 1' }, user: { owns: true, mintingTimestamp: '1620000000' } },
		{ data: { contractAddress: '0x2', name: 'Stamp 2' }, user: { owns: false } },
		{ data: { contractAddress: '0x3', name: 'Stamp 3' }, user: { owns: false } },
	]
}

const mockUserData: UserData = {
	address: '0x1234...5678',
	instagramUsername: null,
	availableStamps: [
		{ stamp: { contractAddress: '0x2' }, since: 1620000000, signature: '', deadline: 0, authentic: true },
		{ stamp: { contractAddress: '0x3' }, since: 1620100000, signature: '', deadline: 0, authentic: false },
	]
}

export default function ProfilePage() {
	const [address, setAddress] = useState<string | undefined>('0x1234...5678') // Mock address
	const [userData, setUserData] = useState<UserData | null>(null)
	const [plasaView, setPlasaView] = useState<typeof mockPlasaView | null>(null)
	const [loading, setLoading] = useState(true)
	const [username, setUsername] = useState<string | null>(null)

	useEffect(() => {
		// Simulate API calls
		setTimeout(() => {
			setUserData(mockUserData)
			setPlasaView(mockPlasaView)
			// Simulate fetching the username from another query
			setUsername(Math.random() > 0.5 ? 'cool.base.eth' : null)
			setLoading(false)
		}, 1500)
	}, [])

	const handleConnectInstagram = (username: string) => {
		setLoading(true)
		setTimeout(() => {
			setUserData(prevData => {
				if (!prevData) return null
				return {
					...prevData,
					instagramUsername: username,
					availableStamps: [
						{ stamp: { contractAddress: '0x2' }, since: Date.now() / 1000, signature: '', deadline: 0, authentic: true },
						{ stamp: { contractAddress: '0x3' }, since: Date.now() / 1000, signature: '', deadline: 0, authentic: false },
					]
				}
			})
			setLoading(false)
		}, 1000)
	}

	const handleStampMint = (stampAddress: string) => {
		setLoading(true)
		setTimeout(() => {
			setUserData(prevData => {
				if (!prevData) return null
				return {
					...prevData,
					availableStamps: prevData.availableStamps?.filter(stamp => stamp.stamp.contractAddress !== stampAddress) || []
				}
			})
			setPlasaView(prevView => {
				if (!prevView) return null
				return {
					...prevView,
					stamps: prevView.stamps.map(stamp =>
						stamp.data.contractAddress === stampAddress
							? { ...stamp, user: { ...stamp.user, owns: true, mintingTimestamp: (Date.now() / 1000).toString() } }
							: stamp
					)
				}
			})
			setLoading(false)
		}, 1000)
	}

	if (!address) {
		return <NotConnectedCard />
	}

	if (loading) {
		return <SkeletonLoader />
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
			<div className="grid gap-6 md:grid-cols-2">
				<div>
					<UsernameCard username={username} />
					<ConnectionsCard userData={userData} onConnectInstagram={handleConnectInstagram} />
				</div>
				<div>
					<StampsCard
						userData={userData}
						plasaView={plasaView}
						onStampMint={handleStampMint}
					/>
				</div>
			</div>
		</div>
	)
}

function NotConnectedCard() {
	return (
		<Card className="w-full max-w-md mx-auto mt-8">
			<CardContent className="pt-6">
				<p className="text-center">Please connect your wallet to view your profile.</p>
			</CardContent>
		</Card>
	)
}

function UsernameCard({ username }: { username: string | null }) {
	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Nombre de usuario</CardTitle>
			</CardHeader>
			<CardContent>
				{username ? (
					<div className="flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white rounded-lg p-4">
						<h2 className="text-2xl font-bold tracking-tight">{username}</h2>
					</div>
				) : (
					<p className="text-muted-foreground">Aún no tienes nombre de usuario</p>
				)}
			</CardContent>
			{!username && (
				<CardFooter>
					<Button asChild className="w-full">
						<Link href="https://www.base.org/names">Obtener nombre de usuario</Link>
					</Button>
				</CardFooter>
			)}
		</Card>
	)
}

function ConnectionsCard({ userData, onConnectInstagram }: { userData: UserData | null, onConnectInstagram: (username: string) => void }) {
	const [instagramUsername, setInstagramUsername] = useState('')

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Conexiones</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Instagram className="text-pink-500" />
						<span className="font-medium">Instagram</span>
					</div>
					{userData?.instagramUsername ? (
						<p className="text-sm font-medium">{userData.instagramUsername}</p>
					) : (
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline" size="sm">Conectar</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Conectar Instagram</DialogTitle>
								</DialogHeader>
								<p className="mb-4">Ingresa tu nombre de usuario de Instagram para conectar tu cuenta.</p>
								<Input
									placeholder="Nombre de usuario de Instagram"
									value={instagramUsername}
									onChange={(e) => setInstagramUsername(e.target.value)}
								/>
								<Button onClick={() => onConnectInstagram(instagramUsername)} className="mt-4 w-full">Conectar</Button>
							</DialogContent>
						</Dialog>
					)}
				</div>
			</CardContent>
		</Card>
	)
}

function StampsCard({ userData, plasaView, onStampMint }: { userData: UserData | null, plasaView: typeof mockPlasaView | null, onStampMint: (address: string) => void }) {
	const ownedStamps = plasaView?.stamps.filter(stamp => stamp.user.owns) || []
	const availableStamps = userData?.availableStamps || []

	if (!userData?.instagramUsername) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Sellos</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">Conecta tu cuenta de Instagram para ver y obtener sellos.</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Sellos</CardTitle>
			</CardHeader>
			<CardContent>
				<h3 className="font-semibold mb-2">Mis Sellos</h3>
				{ownedStamps.length > 0 ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
						{ownedStamps.map(stamp => (
							<StampCard key={stamp.data.contractAddress} stamp={stamp} owned={true} />
						))}
					</div>
				) : (
					<p className="text-muted-foreground mb-6">Aún no tienes sellos.</p>
				)}

				<h3 className="font-semibold mb-2">Sellos Disponibles</h3>
				{availableStamps.length > 0 ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
						{availableStamps.map(stampSig => {
							const stampData = plasaView?.stamps.find(s => s.data.contractAddress === stampSig.stamp.contractAddress)
							return stampData ? (
								<StampCard
									key={stampData.data.contractAddress}
									stamp={stampData}
									onMint={() => onStampMint(stampData.data.contractAddress)}
									since={stampSig.since}
									authentic={stampSig.authentic}
								/>
							) : null
						})}
					</div>
				) : (
					<p className="text-muted-foreground">No hay sellos disponibles en este momento.</p>
				)}
			</CardContent>
		</Card>
	)
}

function StampCard({ stamp, onMint, owned, since, authentic }: {
	stamp: typeof mockPlasaView.stamps[0],
	onMint?: () => void,
	owned?: boolean,
	since?: number,
	authentic?: boolean
}) {
	const formattedDate = (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString()

	return (
		<Card className="overflow-hidden flex flex-col h-full">
			<CardContent className="p-4 flex-grow flex flex-col">
				<h4 className="font-semibold mb-2 truncate">{stamp.data.name}</h4>
				<div className="flex-grow">
					{owned ? (
						<p className="text-xs text-muted-foreground mb-2">
							Desde {formattedDate(Number(stamp.user.mintingTimestamp))}
						</p>
					) : (
						<>
							{since && (
								<p className="text-xs text-muted-foreground mb-2">
									Desde {formattedDate(since)}
								</p>
							)}
							{authentic === false && (
								<Badge variant="outline" className="mb-2 bg-yellow-100 text-yellow-800 border-yellow-300">
									<AlertTriangle className="h-3 w-3 mr-1" />
									Simulado
								</Badge>
							)}
						</>
					)}
				</div>
				{owned ? (
					<Button
						asChild
						size="sm"
						className="w-full mt-2"
					>
						<Link href={`https://etherscan.io/token/${stamp.data.contractAddress}`} target="_blank" rel="noopener noreferrer">
							Ver mi sello <ExternalLink className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				) : onMint && (
					<Button onClick={onMint} size="sm" className="w-full mt-2">Obtener</Button>
				)}
			</CardContent>
		</Card>
	)
}

function SkeletonLoader() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<Skeleton className="h-10 w-48 mb-6" />
			<div className="grid gap-6 md:grid-cols-2">
				<div>
					<Card className="mb-6">
						<CardHeader>
							<Skeleton className="h-6 w-36" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-16 w-full rounded-lg" />
						</CardContent>
					</Card>
					<Card className="mb-6">
						<CardHeader>
							<Skeleton className="h-6 w-36" />
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<Skeleton className="h-6 w-24" />
								<Skeleton className="h-8 w-20" />
							</div>
						</CardContent>
					</Card>
				</div>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-24" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-5 w-32 mb-2" />
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
						</div>
						<Skeleton className="h-5 w-40 mb-2" />
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}