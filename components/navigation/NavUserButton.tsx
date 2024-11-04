'use client'

import { usePrivy } from '@privy-io/react-auth'
import NavUserButtonConnect from './NavUserButtonConnect'
import NavUserButtonConnected from './NavUserButtonConnected'

interface NavUserButtonProps {
	className?: string
}

export function NavUserButton({ className }: NavUserButtonProps) {
	const { authenticated } = usePrivy()

	return authenticated ? (
		<NavUserButtonConnected className={className} />
	) : (
		<NavUserButtonConnect className={className} />
	)
}