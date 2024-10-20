'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { useAccount, useReadContract } from 'wagmi'
import { useName } from '@coinbase/onchainkit/identity'
import { baseSepolia } from 'viem/chains'

import { AlertTriangle, ExternalLink, Instagram } from 'lucide-react'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

import type { UserData } from '@/lib/api/interfaces'

import { contractsGetPlasa } from '@/lib/onchain/contracts'
import { PlasaView } from '@/lib/onchain/types/plasa'

export default function ProfilePage() {
	const { address } = useAccount()
	const [userFirestore, setUserFirestore] = useState<UserData | null>(null)
	const [loading, setLoading] = useState(true)

	const contract = contractsGetPlasa(address)
	const { data: plasa, isLoading: plasaLoading } = useReadContract(contract)

	useEffect(() => {
		if (plasa && address) {
			const plasaView = plasa as unknown as PlasaView
			const stampAddresses = plasaView.stamps
				.filter(stamp => !stamp.user.owns)
				.map(stamp => stamp.data.contractAddress)

			console.log('Stamp addresses:', stampAddresses)

			fetch(`https://getuserdata-i2wvmwqfoq-uc.a.run.app?userAddress=${address}&stampAddresses=${stampAddresses.join(',')}`)
				.then(res => res.json())
				.then(data => {
					console.log('User Firestore data:', data)
					console.log(data)

					setUserFirestore(data)
					setLoading(false)
				})
				.catch(error => {
					console.error("Error fetching user data:", error)
					setLoading(false)
				})
		}
	}, [plasa, address])

	const handleConnectInstagram = (username: string) => {
		setLoading(true)
		setTimeout(() => {
			setUserFirestore(prevData => {
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
			setUserFirestore(prevData => {
				if (!prevData) return null
				return {
					...prevData,
					availableStamps: prevData.availableStamps?.filter(stamp => stamp.stamp.contractAddress !== stampAddress) || []
				}
			})
			setPlasa(prevView => {
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

	if (loading || plasaLoading) {
		return <SkeletonLoader />
	}

	const typedPlasaData = plasa as unknown as PlasaView

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
			<div className="grid gap-6 md:grid-cols-2">
				<div>
					<UsernameCard address={address} />
					<ConnectionsCard userFirestore={userFirestore} onConnectInstagram={handleConnectInstagram} />
				</div>
				<div>
					<StampsCard
						userFirestore={userFirestore}
						plasa={typedPlasaData}
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

function UsernameCard({ address }: { address: string }) {
	const { name: basename } = useName({ address: address as `0x${string}`, chain: baseSepolia })

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Nombre de usuario</CardTitle>
			</CardHeader>
			<CardContent>
				{basename ? (
					<div className="flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white rounded-lg p-4">
						<h2 className="text-2xl font-bold tracking-tight">{basename}</h2>
					</div>
				) : (
					<p className="text-muted-foreground">Aún no tienes nombre de usuario</p>
				)}
			</CardContent>
			{!basename && (
				<CardFooter>
					<Button asChild className="w-full">
						<Link href="https://www.base.org/names">Obtener nombre de usuario</Link>
					</Button>
				</CardFooter>
			)}
		</Card>
	)
}

function ConnectionsCard({ userFirestore, onConnectInstagram }: { userFirestore: UserFirestore | null, onConnectInstagram: (username: string) => void }) {
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
					{userFirestore?.instagramUsername ? (
						<p className="text-sm font-medium">{userFirestore.instagramUsername}</p>
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

function StampsCard({ userFirestore, plasa, onStampMint }: { userFirestore: UserFirestore | null, plasa: PlasaView | null, onStampMint: (address: string) => void }) {
	const ownedStamps = plasa?.stamps.filter(stamp => stamp.user.owns) || []
	const availableStamps = userFirestore?.availableStamps || []

	if (!userFirestore?.instagramUsername) {
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
							const stampData = plasa?.stamps.find(s => s.data.contractAddress === stampSig.stamp.contractAddress)
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
	stamp: typeof mockPlasa.stamps[0],
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
