'use client'

import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'

/**
 * Props interface for the NavUserButtonConnect component
 * @interface NavUserButtonConnectProps
 * @property {string} [className] - Optional CSS class names to be applied to the button
 */
interface NavUserButtonConnectProps {
	className?: string
}

/**
 * Navigation button component that handles wallet connection using Privy
 * @component
 * @param {NavUserButtonConnectProps} props - Component props
 * @returns {JSX.Element} A button element that triggers wallet connection
 */
export default function NavUserButtonConnect({ className }: NavUserButtonConnectProps) {
	const { login } = usePrivy()
	const [isLoading, setIsLoading] = useState(false)

	/**
	 * Handles the wallet connection process
	 * Sets loading state and triggers Privy login
	 */
	const handleConnect = async () => {
		setIsLoading(true)
		try {
			login()
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			variant='default'
			className={`transition-all duration-200 hover:scale-105 ${className}`}
			onClick={handleConnect}
			disabled={isLoading}
		>
			{isLoading ? (
				<span className='animate-pulse'>Conectando...</span>
			) : (
				'Conectar'
			)}
		</Button>
	)
}