'use client'

// External dependencies
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Internal components
import Welcome from './Welcome'
import Space from '@/components/space/Space'
import ConnectButton from '@/components/common/ConnectButton'

// Contexts
import { useRegistration } from '@/contexts/RegistrationContext'

/**
 * Home Component
 * 
 * Handles the main routing logic for authenticated and non-authenticated users.
 * Displays either the Space component for authenticated users or the Welcome
 * component for non-authenticated users. Also manages redirection to onboarding
 * for authenticated users who haven't completed registration.
 * 
 * @returns {JSX.Element} The rendered Home component
 */
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
