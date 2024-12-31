'use client'

import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'

/**
 * Props interface for the ConnectButton component
 * @interface ConnectButtonProps
 * @property {string} [className] - Optional CSS class names to be applied to the button
 */
interface ConnectButtonProps {
	className?: string
	text?: string
}

export default function ConnectButton({ className, text }: ConnectButtonProps) {
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
				text || 'Ingresar'
			)}
		</Button>
	)
}