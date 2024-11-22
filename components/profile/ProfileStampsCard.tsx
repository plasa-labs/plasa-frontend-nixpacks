import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProfileStampCard from './ProfileStampCard'
import { useSpace } from '@/contexts/SpaceContext'
import { useFirestore } from '@/contexts/FirestoreContext'

interface ProfileStampsCardProps {
	/** Callback function triggered when a stamp is minted */
	onStampMint: (address: string) => void
}

/**
 * ProfileStampsCard displays a user's owned and available stamps
 * 
 * @component
 * @param {ProfileStampsCardProps} props - Component props
 * @param {Function} props.onStampMint - Callback function when a stamp is minted
 * @returns {React.ReactElement | null} The rendered component or null if space is not available
 */
export default function ProfileStampsCard({ onStampMint }: ProfileStampsCardProps) {
	const { space } = useSpace()
	const { userFirestore } = useFirestore()

	if (!space) return null

	const stamps = space.points.stamps
	const ownedStamps = stamps.filter(stamp => stamp.user.owns)
	const notOwnedStamps = stamps.filter(stamp => !stamp.user.owns)

	if (!userFirestore?.instagram_username) {
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
				<h3 className="font-semibold mb-4">Mis sellos</h3>
				{ownedStamps.length > 0 ? (
					<div className="space-y-4 mb-6">
						{ownedStamps.map(stamp => (
							<ProfileStampCard
								key={stamp.data.contractAddress}
								stamp={stamp}
							/>
						))}
					</div>
				) : (
					<p className="text-muted-foreground mb-6">Aún no tienes sellos.</p>
				)}

				<h3 className="font-semibold mb-4 mt-10">Sellos disponibles</h3>
				{notOwnedStamps.length > 0 ? (
					<div className="space-y-4">
						{notOwnedStamps.map(stamp => (
							<ProfileStampCard
								key={stamp.data.contractAddress}
								stamp={stamp}
								onMint={() => onStampMint(stamp.data.contractAddress)}
							/>
						))}
					</div>
				) : (
					<p className="text-muted-foreground">No hay sellos disponibles en este momento.</p>
				)}
			</CardContent>
		</Card>
	)
}
