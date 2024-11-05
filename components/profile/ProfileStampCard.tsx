import Link from 'next/link'
import { AlertTriangle, ExternalLink } from 'lucide-react'

// UI Components
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import TransactionButton from '@/components/common/TransactionButton'

// Utils & Types
import { contractsMintStamp } from '@/lib/onchain/contracts'
import type { PointsStampView } from '@/lib/onchain/types/interfaces'
import { formatDate, formatPoints } from '@/lib/utils/formatters'

// Contexts
import { useFirestore } from '@/contexts/FirestoreContext'

/**
 * Interface for ProfileStampCard component props
 * @property {StampView} stamp - The stamp data to display
 * @property {() => void} [onMint] - Optional callback function when stamp is minted
 * @property {boolean} [owned] - Whether the stamp is owned by the user
 * @property {number} [since] - Timestamp indicating when the stamp was acquired
 * @property {boolean} [authentic] - Whether the stamp is authentic or simulated
 */
interface ProfileStampCardProps {
	stamp: PointsStampView
	onMint?: () => void
	owned?: boolean
	since?: number
	authentic?: boolean
}

/**
 * ProfileStampCard component displays information about a stamp and provides
 * functionality to either view or mint the stamp depending on ownership status.
 */
export default function ProfileStampCard({
	stamp,
	onMint,
	owned,
	since,
	authentic,
}: ProfileStampCardProps) {
	const { userFirestore } = useFirestore()

	const followerSince: bigint = owned ? BigInt(stamp.user.specific) : BigInt(since || 0)

	const stampFirestoreData = userFirestore?.availableStamps?.find(
		s => s.stamp.contractAddress === stamp.data.contractAddress
	)

	const multiplier = stamp.data.multiplier

	const accumulatedPoints: bigint =
		(BigInt(Math.floor(Date.now() / 1000)) - followerSince) *
		BigInt(1e18) *
		BigInt(multiplier) /
		BigInt(86400)


	return (
		<Card className="overflow-hidden flex flex-col h-full">
			<CardContent className="p-4 flex-grow flex flex-col">
				<h4 className="font-semibold mb-2 truncate">@{stamp.data.name}</h4>
				<div className="flex-grow">
					{/* Title is always shown above */}

					{/* Since line - show if owned or authentic */}
					{(owned || authentic) && (
						<p className="text-xs text-muted-foreground mb-2">
							Desde {formatDate(followerSince)}
						</p>
					)}

					{/* Points per day - always shown */}
					<p className="text-xs text-muted-foreground mb-2">
						{multiplier} {multiplier > 1 ? 'puntos' : 'punto'} por día
					</p>

					{/* Accumulated points - show if owned or authentic */}
					{(owned || authentic) && (
						<p className="text-xs text-muted-foreground mb-2">
							{formatPoints(accumulatedPoints)} puntos acumulados
						</p>
					)}

					{/* Show simulated badge if not authentic */}
					{/* {authentic === false && (
						<Badge variant="outline" className="mb-2 bg-yellow-100 text-yellow-800 border-yellow-300">
							<AlertTriangle className="h-3 w-3 mr-1" />
							Simulado
						</Badge>
					)} */}
				</div>

				{/* Button logic */}
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
				) : authentic === false ? (
					<Button
						size="sm"
						className="w-full mt-2"
						disabled
					>
						No cumplís con los requisitos para obtener este sello.
					</Button>
				) : onMint && stampFirestoreData && (
					<TransactionButton
						text="Obtener sello"
						className="w-full"
						transactionData={contractsMintStamp(
							stamp.data.contractAddress as `0x${string}`,
							stampFirestoreData.since,
							stampFirestoreData.deadline,
							stampFirestoreData.signature as `0x${string}`
						)}
						onSuccess={onMint}
					/>
				)}
			</CardContent>
		</Card>
	)
}
