'use client'

import { useSpace } from '@/contexts/SpaceContext'
import { usePrivy } from '@privy-io/react-auth'
import { useFirestore } from '@/contexts/FirestoreContext'
import { setInstagramUsername } from '@/lib/api/endpoints'

// Components
import { ProfileNotConnectedCard } from './ProfileNotConnectedCard'
import { ProfileUsernameCard } from './ProfileUsernameCard'
import { ProfileConnectionsCard } from './ProfileConnectionsCard'
import { ProfileStampsCard } from './ProfileStampsCard'
import { ProfileSkeletonLoader } from './ProfileSkeletonLoader'

// Types
import type { UserData } from '@/lib/api/interfaces'

export function Profile() {
	const { user, authenticated } = usePrivy()
	const { isLoading: firestoreLoading, updateUserData } = useFirestore()
	const userAddress = user?.smartWallet?.address as `0x${string}`
	const { isLoading: spaceLoading, refetch: refetchSpace } = useSpace()

	if (!authenticated) {
		return <ProfileNotConnectedCard />
	}

	const handleConnectInstagram = async (username: string) => {
		try {
			const processedUsername: string = username.toLowerCase().replace(/\s+/g, '').replace('@', '')

			const updatedUserData: UserData = await setInstagramUsername(userAddress, processedUsername)

			await updateUserData(updatedUserData)
		} catch (error) {
			console.error('Error connecting Instagram:', error)
			throw error
		}
	}

	const handleStampMint = () => {
		refetchSpace()
	}

	if (firestoreLoading || spaceLoading) {
		return <ProfileSkeletonLoader />
	}

	return (
		<div className="main-container">
			<h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
			<div className="grid gap-6 md:grid-cols-2">
				<div>
					<ProfileUsernameCard />
					<ProfileConnectionsCard
						onConnectInstagram={handleConnectInstagram}
					/>
				</div>
				<div>
					<ProfileStampsCard
						onStampMint={handleStampMint}
					/>
				</div>
			</div>
		</div>
	)
} 