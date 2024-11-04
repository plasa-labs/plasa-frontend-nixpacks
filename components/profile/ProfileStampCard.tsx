import Link from 'next/link'
import { AlertTriangle, ExternalLink } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { contractsMintStamp } from '@/lib/onchain/contracts'
import type { UserData } from '@/lib/api/interfaces'
import type { StampView } from '@/lib/onchain/types/interfaces'
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets'

interface ProfileStampCardProps {
	stamp: StampView
	onMint?: () => void
	owned?: boolean
	since?: number
	authentic?: boolean
	userFirestore: UserData | null
}

export function ProfileStampCard({ stamp, onMint, owned, since, authentic, userFirestore }: ProfileStampCardProps) {
	const { sendTransaction } = usePrivy()
	const { client } = useSmartWallets()

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

	const handleMint = async () => {
		if (!stampFirestoreData || !client) {
			console.log('Mint aborted: Missing required data')
			return
		}

		try {
			console.log('Starting mint process for stamp:', {
				contractAddress: stamp.data.contractAddress,
				since: stampFirestoreData.since,
				deadline: stampFirestoreData.deadline,
				signature: stampFirestoreData.signature
			})

			const { to, data } = contractsMintStamp(
				stamp.data.contractAddress as `0x${string}`,
				stampFirestoreData.since,
				stampFirestoreData.deadline,
				stampFirestoreData.signature as `0x${string}`
			)

			const txReceipt = await client.sendTransaction({
				to,
				data,
				account: client.account
			})

			console.log('Mint transaction successful:', {
				receipt: txReceipt,
				stampName: stamp.data.name
			})
			if (onMint) onMint()
		} catch (error) {
			console.error('Mint transaction failed:', {
				error,
				stampData: {
					contractAddress: stamp.data.contractAddress,
					name: stamp.data.name
				}
			})
		}
	}

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
					<Button
						size="sm"
						className="w-full mt-2"
						onClick={handleMint}
					>
						Obtener sello
					</Button>
				)}
			</CardContent>
		</Card>
	)
}
