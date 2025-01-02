'use client'

// External dependencies
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Internal components
import Welcome from './Welcome'
import Space from '@/components/space/Space'

// Contexts
import { useRegistration } from '@/contexts/RegistrationContext'

export default function Home() {
	const { isRegistered, isLoading } = useRegistration()
	const { authenticated, ready } = usePrivy()
	const router = useRouter()

	useEffect(() => {
		if (ready && authenticated && !isLoading && !isRegistered) {
			router.push('/onboarding')
		}
	}, [authenticated, isRegistered, router, isLoading, ready])

	if (!ready) {
		return <Welcome />
	}

	return (
		<>
			{isLoading ? <Welcome /> :
				authenticated ? <Space /> : <>
					<Welcome />
					{/* <ConnectButton /> */}
				</>
			}
		</>
	)
}
