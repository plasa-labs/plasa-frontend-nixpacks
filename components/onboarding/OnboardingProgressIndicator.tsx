import { Check } from 'lucide-react'

import { useRegistration } from '@/contexts/RegistrationContext'

interface Step {
	name: string
	// Add other step properties if they exist
}

/**
 * ProgressIndicator Component
 * 
 * Displays a progress bar and step indicators for a multi-step onboarding process.
 * Shows completed steps with checkmarks, current step highlighted, and upcoming steps in muted colors.
 */
export default function ProgressIndicator(): JSX.Element {
	const { steps, currentStep } = useRegistration()
	const currentStepIndex = steps.indexOf(currentStep)

	return (
		<div className="mb-8">
			{/* Step indicators */}
			<div className="flex justify-between mb-2">
				{steps.map((step: Step, index: number) => (
					<div
						key={step.name}
						className={`
							flex flex-col items-center flex-1
							${index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'}
						`}
					>
						{/* Circle indicator */}
						<div
							className={`
								w-8 h-8 rounded-full 
								flex items-center justify-center border-2
								${index < currentStepIndex
									? 'bg-primary text-primary-foreground border-primary'
									: index === currentStepIndex
										? 'border-primary'
										: 'border-muted-foreground'
								}
							`}
						>
							{index < currentStepIndex ? (
								<Check className="w-5 h-5" />
							) : (
								<span>{index + 1}</span>
							)}
						</div>

						{/* Step name */}
						<span className="text-xs mt-1 font-medium text-center">
							{step.name}
						</span>
					</div>
				))}
			</div>

			{/* Progress bar */}
			<div className="relative pt-1">
				<div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-muted">
					<div
						style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
						className="
							shadow-none flex flex-col text-center 
							whitespace-nowrap text-white justify-center bg-primary 
							transition-all duration-500 ease-in-out
						"
					/>
				</div>
			</div>
		</div>
	)
}

