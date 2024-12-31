// React and core dependencies
import { useState } from 'react'

// UI Components
import { Button } from '@/components/ui/button'
import ProfileStampCard from '@/components/profile/ProfileStampCard'

// Contexts
import { useSpace } from '@/contexts/SpaceContext'
import { useFirestore } from '@/contexts/FirestoreContext'
import { useRegistration } from '@/contexts/RegistrationContext'

function Explanation() {
	return <>
		<p>
			Para participar en la plataforma, necesitás tener puntos.
			Estos puntos se obtienen a partir de distintos sellos.
		</p>
		<br />
		<p>
			Para comenzar, vas a poder obtener sellos que representan que seguís a determinadas cuentas de Instagram.
			Pero nadie va a poder ver cuál es tu cuenta de Instagram.
		</p>
	</>
}

function Stamps() {
	const { space, refetch } = useSpace()
	const { userFirestore } = useFirestore()
	const { setShowCongrats } = useRegistration()

	if (!space) return null

	// Sort stamps with owned ones first
	const stamps = space.points.stamps.sort((a, b) => {
		if (a.stamp.user.owns && !b.stamp.user.owns) return -1
		if (!a.stamp.user.owns && b.stamp.user.owns) return 1
		return 0
	})

	// Check if user has stamps available to mint
	const hasMintableStamps = stamps.some(stamp => {
		const isNotOwned = !stamp.stamp.user.owns
		const isAvailableInFirestore = userFirestore?.available_stamps?.some(
			s => s.stamp.contractAddress === stamp.stamp.data.contractAddress
		)
		return isNotOwned && isAvailableInFirestore
	})

	const handleComplete = () => {
		setShowCongrats(true)
	}

	const handleStampMint = () => {
		if (!space) return
		refetch()
	}

	return (
		<div>
			<h3 className="font-semibold mb-4">Sellos</h3>
			{stamps.length > 0 ? (
				<>
					<div className="space-y-4">
						{stamps.map(stamp => (
							<ProfileStampCard
								key={stamp.stamp.data.contractAddress}
								stamp={stamp}
								onMint={handleStampMint}
							/>
						))}
					</div>
					{!hasMintableStamps && stamps.some(stamp => stamp.stamp.user.owns) && (
						<p className="text-muted-foreground mt-4">
							Ya has obtenido todos los sellos disponibles.
						</p>
					)}
					{!hasMintableStamps && !stamps.some(stamp => stamp.stamp.user.owns) && (
						<p className="text-muted-foreground mt-4">
							No tenés sellos disponibles para obtener en este momento. Podés seguir las cuentas de Instagram para poder obtener sellos en un futuro.
						</p>
					)}
				</>
			) : (
				<p className="text-muted-foreground">No hay sellos disponibles en este momento.</p>
			)}
			<div className="flex justify-end mt-4">
				<Button onClick={handleComplete} disabled={hasMintableStamps}>
					Finalizar
				</Button>
			</div>
		</div>
	)
}

export default function StampsStep() {
	const [readExplanation, setReadExplanation] = useState(false)

	const handleReadExplanation = () => setReadExplanation(true)

	return (
		<>
			{!readExplanation ? (
				<>
					<Explanation />
					<br />
					<div className="flex justify-end">
						<Button onClick={handleReadExplanation}>
							Entendido
						</Button>
					</div>
				</>
			) : (
				<Stamps />
			)}
		</>
	)
}

