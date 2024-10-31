'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'

// Types and interfaces
import type { UserData } from '@/lib/api/interfaces'
import { PlasaView } from '@/lib/onchain/types/plasa'

// Local utilities and contracts
import { contractsGetPlasa } from '@/lib/onchain/contracts'
import { fetchUser, setInstagramUsername } from '@/lib/api/endpoints'

// Components
import { ProfileNotConnectedCard } from './components/ProfileNotConnectedCard'
import { ProfileUsernameCard } from './components/ProfileUsernameCard'
import { ProfileConnectionsCard } from './components/ProfileConnectionsCard'
import { ProfileStampsCard } from './components/ProfileStampsCard'
import { ProfileSkeletonLoader } from './components/ProfileSkeletonLoader'

export default function ProfilePage() {
	const { address } = useAccount()
	const [userFirestore, setUserFirestore] = useState<UserData | null>(null)
	const [loading, setLoading] = useState(true)

	const contract = contractsGetPlasa(address)
	const { data: plasa, isLoading: plasaLoading, refetch: refetchPlasa } = useReadContract(contract)

	useEffect(() => {
		if (plasa && address) {
			// const plasaView = plasa as unknown as PlasaView
			// const stampAddresses = plasaView.stamps
			// 	.filter(stamp => !stamp.user.owns)
			// 	.map(stamp => stamp.data.contractAddress)

			// console.log('Stamp addresses:', stampAddresses)

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
	}, [plasa, address])

	const handleConnectInstagram = async (username: string) => {
		setLoading(true)
		try {
			// Process the username: convert to lowercase, remove spaces and '@' symbols
			const processedUsername = username.toLowerCase().replace(/\s+/g, '').replace('@', '')
			console.log('Processed username:', processedUsername)

			// Use the setInstagramUsername function from endpoints.ts
			const updatedUserData = await setInstagramUsername(address as string, processedUsername)
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
		return <ProfileNotConnectedCard />
	}

	if (loading || plasaLoading) {
		return <ProfileSkeletonLoader />
	}

	const typedPlasaData = plasa as unknown as PlasaView

	return (
		<div className="main-container" suppressHydrationWarning={true}>
			<h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
			<div className="grid gap-6 md:grid-cols-2">
				<div>
					<ProfileUsernameCard address={address} />
					<ProfileConnectionsCard userFirestore={userFirestore} onConnectInstagram={handleConnectInstagram} />
				</div>
				<div>
					<ProfileStampsCard
						userFirestore={userFirestore}
						plasa={typedPlasaData}
						onStampMint={handleStampMint}
					/>
				</div>
			</div>
		</div>
	)
}
