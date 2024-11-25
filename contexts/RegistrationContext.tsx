'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { usePlasa } from './PlasaContext'
import { useFirestore } from './FirestoreContext'

import NameStep from '@/components/onboarding/steps/NameStep'
import InstagramStep from '@/components/onboarding/steps/InstagramStep'
import StampsStep from '@/components/onboarding/steps/StampsStep'

type RegistrationContextType = {
	isRegistered: boolean
	steps: Step[]
	currentStep: Step
	setCurrentStep: (step: Step) => void
	nextStep: () => void
	showCongrats: boolean
	setShowCongrats: (show: boolean) => void
}

type Step = {
	name: string
	component: () => JSX.Element
}

const steps: Step[] = [
	{ name: 'Nombre de usuario', component: NameStep },
	{ name: 'Instagram', component: InstagramStep },
	{ name: 'Sellos', component: StampsStep },
]

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined)

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [currentStep, setCurrentStep] = useState<Step>(steps[0])
	const [showCongrats, setShowCongrats] = useState(false)

	const { instagram } = useFirestore()
	const { username } = usePlasa()

	useEffect(() => {
		if (!username) {
			setCurrentStep(steps[0])
		} else if (!instagram) {
			setCurrentStep(steps[1])
		} else {
			setCurrentStep(steps[2])
		}
	}, [username, instagram])

	const nextStep = useCallback(() => {
		const currentIndex = steps.indexOf(currentStep)
		if (currentIndex < steps.length - 1) {
			setCurrentStep(steps[currentIndex + 1])
		} else {
			setShowCongrats(true)
		}
	}, [currentStep])

	return (
		<RegistrationContext.Provider
			value={{
				isRegistered: !!username && !!instagram,
				steps,
				currentStep,
				setCurrentStep,
				nextStep,
				showCongrats,
				setShowCongrats,
			}}
		>
			{children}
		</RegistrationContext.Provider >
	)
}

export const useRegistration = () => {
	const context = useContext(RegistrationContext)
	if (context === undefined) {
		throw new Error('useRegistration must be used within a RegistrationProvider')
	}
	return context
}

export { RegistrationContext }

