import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useRegistration } from '@/contexts/RegistrationContext'
import LoadingScreen from './LoadingScreen'

interface RequireRegistrationProps {
	children: React.ReactNode
}

export default function RequireRegistration({ children }: RequireRegistrationProps) {
	const router = useRouter()
	const { authenticated, ready } = usePrivy()
	const { isRegistered, isLoading } = useRegistration()

	useEffect(() => {
		if (!ready) return

		if (!authenticated) {
			router.push('/')
			return
		}

		if (!isLoading && !isRegistered) {
			router.push('/onboarding')
			return
		}
	}, [authenticated, isRegistered, router, isLoading, ready])

	if (!ready || isLoading || !authenticated || !isRegistered) {
		return <LoadingScreen fullScreen />
	}

	return <>{children}</>
} 