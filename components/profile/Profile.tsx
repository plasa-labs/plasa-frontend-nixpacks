'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useSpace } from '@/contexts/SpaceContext'

// Types and interfaces
import type { UserData } from '@/lib/api/interfaces'
// import { PlasaView } from '@/lib/onchain/types/interfaces'

// Local utilities and contracts
import { fetchUser, setInstagramUsername } from '@/lib/api/endpoints'

// Components
import { ProfileNotConnectedCard } from './ProfileNotConnectedCard'
import { ProfileUsernameCard } from './ProfileUsernameCard'
import { ProfileConnectionsCard } from './ProfileConnectionsCard'
import { ProfileStampsCard } from './ProfileStampsCard'
import { ProfileSkeletonLoader } from './ProfileSkeletonLoader'

export function Profile() {
	const { address } = useAccount()
	const [userFirestore, setUserFirestore] = useState<UserData | null>(null)
	const [loading, setLoading] = useState(true)

	const { space, isLoading: spaceLoading, refetch: refetchSpace } = useSpace()

	useEffect(() => {
		if (space && address) {
			fetchUser(address)
				.then(data => {
					setUserFirestore(data)
					setLoading(false)
				})
				.catch(error => {
					console.error('Error fetching user data:', error)
					setLoading(false)
				})
		}
	}, [space, address])

	if (!address) {
		return <ProfileNotConnectedCard />
	}

	const handleConnectInstagram = async (username: string) => {
		setLoading(true)
		try {
			const processedUsername = username.toLowerCase().replace(/\s+/g, '').replace('@', '')
			const updatedUserData = await setInstagramUsername(address, processedUsername)
			setUserFirestore(updatedUserData)
		} catch (error) {
			console.error('Error connecting Instagram:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleStampMint = () => {
		setLoading(true)
		refetchSpace()
		setLoading(false)
	}

	if (loading || spaceLoading) {
		return <ProfileSkeletonLoader />
	}

	return (
		<div className="main-container">
			<h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
			<div className="grid gap-6 md:grid-cols-2">
				<div>
					<ProfileUsernameCard />
					<ProfileConnectionsCard userFirestore={userFirestore} onConnectInstagram={handleConnectInstagram} />
				</div>
				<div>
					<ProfileStampsCard
						userFirestore={userFirestore}
						onStampMint={handleStampMint}
					/>
				</div>
			</div>
		</div>
	)
} 