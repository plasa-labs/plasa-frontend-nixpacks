'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'

// Types and interfaces
import type { UserData } from '@/lib/api/interfaces'
import { PlasaView } from '@/lib/onchain/types/plasa'

// Local utilities and contracts
import { contractsGetPlasa } from '@/lib/onchain/contracts'

// Components
import { NotConnectedCard } from './components/NotConnectedCard'
import { UsernameCard } from './components/UsernameCard'
import { ConnectionsCard } from './components/ConnectionsCard'
import { StampsCard } from './components/StampsCard'
import { SkeletonLoader } from './components/SkeletonLoader'

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
			// Process the username: convert to lowercase, remove spaces and '@' symbols
			const processedUsername = username.toLowerCase().replace(/\s+/g, '').replace('@', '')

			const response = await fetch('https://linkinstagram-i2wvmwqfoq-uc.a.run.app', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userAddress: address, instagramUsername: processedUsername }),
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
		<div className="container mx-auto px-4 py-8">
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
