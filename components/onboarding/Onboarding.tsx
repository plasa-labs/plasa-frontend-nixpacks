'use client'

// External dependencies
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'

// Internal UI components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import OnboardingProgressIndicator from './OnboardingProgressIndicator'

// Context hooks
import { useRegistration } from '@/contexts/RegistrationContext'
import { useFirestore } from '@/contexts/FirestoreContext'
import { usePlasa } from '@/contexts/PlasaContext'

/**
 * OnboardingContent Component
 * 
 * Handles the main onboarding flow logic and UI rendering.
 * Manages user progress through registration steps and redirects
 * based on authentication status and profile completion.
 */
function OnboardingContent() {
	// Context hooks
	const { currentStep, setCurrentStep, steps, showCongrats } = useRegistration()
	const { authenticated } = usePrivy()
	const { instagram } = useFirestore()
	const { username } = usePlasa()

	const router = useRouter()

	// Handle step navigation and authentication checks
	useEffect(() => {
		// Redirect to home if not authenticated
		if (!authenticated) {
			router.push('/')
			return
		}

		// Set current step based on profile completion
		if (!username) {
			setCurrentStep(steps[0]) // Username step
		} else if (!instagram) {
			setCurrentStep(steps[1]) // Instagram step
		} else {
			setCurrentStep(steps[2]) // Final step
		}
	}, [authenticated, username, instagram, steps, setCurrentStep, router])

	const handleFinish = () => {
		router.push('/')
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<div className="w-full max-w-2xl px-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-center">Completá tu perfil</CardTitle>
					</CardHeader>
					<CardContent>
						{!showCongrats ? (
							<>
								<OnboardingProgressIndicator />
								{currentStep.component && <currentStep.component />}
							</>
						) : (
							<div className="text-center space-y-4">
								<p>Has completado tu registro exitosamente.</p>
								<Button onClick={handleFinish} size="lg">
									Ir a inicio
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

/**
 * Onboarding Component
 * 
 * Main export wrapper for the onboarding flow.
 */
export default function Onboarding() {
	return <OnboardingContent />
}

