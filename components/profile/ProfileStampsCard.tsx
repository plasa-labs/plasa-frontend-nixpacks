import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileStampCard } from './ProfileStampCard'
// import type { PlasaView } from '@/lib/onchain/types/interfaces'
import { useSpace } from '@/contexts/SpaceContext'
import { useFirestore } from '@/contexts/FirestoreContext'

interface ProfileStampsCardProps {
	onStampMint: (address: string) => void
}

export function ProfileStampsCard({ onStampMint }: ProfileStampsCardProps) {
	const { space } = useSpace()
	const { userFirestore } = useFirestore()
	if (!space) return null

	const stamps = space.points.stamps

	const ownedStamps = stamps.filter(stamp => stamp.user.owns)

	const availableStamps = userFirestore?.availableStamps?.filter(stampSig =>
		!ownedStamps.some(ownedStamp => ownedStamp.data.contractAddress === stampSig.stamp.contractAddress)
	) || []

	if (!userFirestore?.instagram) {
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
				<h3 className="font-semibold mb-2">Mis sellos</h3>
				{ownedStamps.length > 0 ? (
					<div className="space-y-4 mb-6">
						{ownedStamps.map(stamp => (
							<ProfileStampCard key={stamp.data.contractAddress} stamp={stamp} owned={true} userFirestore={userFirestore} />
						))}
					</div>
				) : (
					<p className="text-muted-foreground mb-6">Aún no tienes sellos.</p>
				)}

				<h3 className="font-semibold mb-2">Sellos disponibles</h3>
				{availableStamps.length > 0 ? (
					<div className="space-y-4">
						{availableStamps.map(stampSig => {
							const stampData = stamps.find(s => s.data.contractAddress === stampSig.stamp.contractAddress)
							return stampData ? (
								<ProfileStampCard
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
