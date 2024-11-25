'use client'

// External dependencies
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'

// Internal components
import Welcome from './Welcome'
import Space from '@/components/space/Space'

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
export default function Home(): JSX.Element {
	const { isRegistered } = useRegistration()
	const { authenticated } = usePrivy()
	const router = useRouter()

	// Redirect to onboarding if user is authenticated but not registered
	if (authenticated && !isRegistered) {
		router.push('/onboarding')
	}

	return (
		<>
			{authenticated ? <Space /> : <Welcome />}
		</>
	)
}
