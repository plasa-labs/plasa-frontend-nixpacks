'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { usePrivy } from '@privy-io/react-auth'

interface NavUserButtonConnectProps {
	className?: string
}

export default function NavUserButtonConnect({ className }: NavUserButtonConnectProps) {
	const { login } = usePrivy()
	const [isLoading, setIsLoading] = useState(false)

	const handleConnect = async () => {
		setIsLoading(true)
		try {
			await login()
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			variant="default"
			className={`transition-all duration-200 hover:scale-105 ${className}`}
			onClick={handleConnect}
			disabled={isLoading}
		>
			{isLoading ? (
				<span className="animate-pulse">Conectando...</span>
			) : (
				"Conectar"
			)}
		</Button>
	)
}