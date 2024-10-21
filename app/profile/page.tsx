'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Third-party libraries
import { useAccount, useReadContract } from 'wagmi'
import { useName } from '@coinbase/onchainkit/identity'
import { baseSepolia } from 'viem/chains'
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel, TransactionStatusAction } from '@coinbase/onchainkit/transaction'

// UI components
import { AlertTriangle, ExternalLink, Instagram } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

// Types and interfaces
import type { UserData } from '@/lib/api/interfaces'
import { PlasaView } from '@/lib/onchain/types/plasa'
import { StampView } from '@/lib/onchain/types/stamps'

// Local utilities and contracts
import { contractsGetPlasa, contractsMintStamp } from '@/lib/onchain/contracts'

export default function ProfilePage() {
	const { address } = useAccount()
	const [userFirestore, setUserFirestore] = useState<UserData | null>(null)
	const [loading, setLoading] = useState(true)

	const contract = contractsGetPlasa(address)
	const { data: plasa, isLoading: plasaLoading, refetch: refetchPlasa } = useReadContract(contract)

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

	const handleConnectInstagram = async (username: string) => {
		setLoading(true)
		try {
			const response = await fetch('https://linkinstagram-i2wvmwqfoq-uc.a.run.app', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userAddress: address, instagramUsername: username }),
			})
			const updatedUserData = await response.json()
			setUserFirestore(updatedUserData)
		} catch (error) {
			console.error('Error connecting Instagram:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleStampMint = () => {
		setLoading(true)
		refetchPlasa()
		setLoading(false)
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
				<p className="text-center">Conectá tu cuenta para ver tu perfil.</p>
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

function ConnectionsCard({ userFirestore, onConnectInstagram }: { userFirestore: UserData | null, onConnectInstagram: (username: string) => void }) {
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
								<p className="mb-4">La API de Instagram Basic Display requiere que el usuario sea invitado y acepte participar como tester en la plataforma de Meta Developers. Para evitarlo y no pedirles autenticación real, podés ingresar directamente tu nombre de usuario de Instagram.</p>
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

function StampsCard({ userFirestore, plasa, onStampMint }: { userFirestore: UserData | null, plasa: PlasaView | null, onStampMint: (address: string) => void }) {
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
					<div className="space-y-4 mb-6">
						{ownedStamps.map(stamp => (
							<StampCard key={stamp.data.contractAddress} stamp={stamp} owned={true} userFirestore={userFirestore} />
						))}
					</div>
				) : (
					<p className="text-muted-foreground mb-6">Aún no tienes sellos.</p>
				)}

				<h3 className="font-semibold mb-2">Sellos Disponibles</h3>
				{availableStamps.length > 0 ? (
					<div className="space-y-4">
						{availableStamps.map(stampSig => {
							const stampData = plasa?.stamps.find(s => s.data.contractAddress === stampSig.stamp.contractAddress)
							return stampData ? (
								<StampCard
									key={stampData.data.contractAddress}
									stamp={stampData}
									onMint={() => onStampMint(stampData.data.contractAddress)}
									since={stampSig.since}
									authentic={stampSig.authentic}
									userFirestore={userFirestore}
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

function StampCard({ stamp, onMint, owned, since, authentic, userFirestore }: {
	stamp: StampView,
	onMint?: () => void,
	owned?: boolean,
	since?: number,
	authentic?: boolean,
	userFirestore: UserData | null
}) {
	const formattedDate = (timestamp: number) => {
		const date = new Date(timestamp * 1000)
		return date.toLocaleDateString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			timeZone: 'America/Argentina/Buenos_Aires'
		})
	}

	const stampFirestoreData = userFirestore?.availableStamps?.find(
		s => s.stamp.contractAddress === stamp.data.contractAddress
	)

	return (
		<Card className="overflow-hidden flex flex-col h-full">
			<CardContent className="p-4 flex-grow flex flex-col">
				<h4 className="font-semibold mb-2 truncate">@{stamp.data.name}</h4>
				<div className="flex-grow">
					{owned ? (
						<p className="text-xs text-muted-foreground mb-2">
							Desde {formattedDate(Number(stamp.user.specific))}
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
						<Link href={`https://sepolia.basescan.org/token/${stamp.data.contractAddress}?a=${stamp.user.stampId}`} target="_blank" rel="noopener noreferrer">
							Ver mi sello <ExternalLink className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				) : onMint && stampFirestoreData && (
					<Transaction
						chainId={84532} // Base Sepolia chain ID
						contracts={contractsMintStamp(
							stamp.data.contractAddress as `0x${string}`,
							stampFirestoreData.since,
							stampFirestoreData.deadline,
							stampFirestoreData.signature as `0x${string}`
						)}
						onSuccess={(response) => {
							console.log('Mint transaction successful:', response)
							onMint()
						}}
						onError={(error) => {
							console.error('Mint transaction failed:', error)
						}}
					>
						<TransactionButton text="Obtener" className="w-full mt-2" />
						<TransactionStatus>
							<TransactionStatusLabel />
							<TransactionStatusAction />
						</TransactionStatus>
					</Transaction>
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
