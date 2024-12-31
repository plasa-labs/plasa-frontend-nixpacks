'use client'

import { usePrivy } from '@privy-io/react-auth'

// Internal component imports
import ConnectButton from '../common/ConnectButton'
import NavUserButtonConnected from './NavUserButtonConnected'

/**
 * Props interface for the NavUserButton component
 * @interface NavUserButtonProps
 * @property {string} [className] - Optional CSS class name for styling
 */
interface NavUserButtonProps {
	className?: string
}

export default function NavUserButton({ className }: NavUserButtonProps) {
	const { authenticated } = usePrivy()

	return authenticated ? (
		<NavUserButtonConnected className={className} />
	) : (
		<ConnectButton className={className} />
	)
}