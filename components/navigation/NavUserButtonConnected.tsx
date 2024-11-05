'use client'

// External dependencies
import Link from 'next/link'
import { usePrivy } from '@privy-io/react-auth'
import { User, LogOut } from 'lucide-react'

// Internal UI components
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

// Types
interface NavUserButtonConnectedProps {
	className?: string
}

// Contexts
import { usePlasa } from '@/contexts/PlasaContext'

/**
 * NavUserButtonConnected - A navigation button component for authenticated users
 * 
 * Displays a dropdown menu with user-related actions like profile access,
 * settings, and logout functionality.
 * 
 * @param {NavUserButtonConnectedProps} props - Component props
 * @param {string} [props.className] - Optional CSS classes to apply to the button
 */
export default function NavUserButtonConnected({ className }: NavUserButtonConnectedProps) {
	const { logout } = usePrivy()
	const { displayName } = usePlasa()
	/**
	 * Handles user logout action
	 */
	const handleDisconnect = async () => {
		await logout()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					className={`transition-all duration-200 hover:scale-105 ${className}`}
				>
					<User className='mr-2 h-4 w-4' />
					<span className='max-w-[150px] truncate'>{displayName}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<Link href='/profile' className='w-full' prefetch={true}>
					<DropdownMenuItem>
						<User className='mr-2 h-4 w-4' />
						<span>Mi Perfil</span>
					</DropdownMenuItem>
				</Link>
				{/* <DropdownMenuItem>
					<Settings className='mr-2 h-4 w-4' />
					<span>Configuración</span>
				</DropdownMenuItem> */}
				<DropdownMenuItem onClick={handleDisconnect} className='text-red-500'>
					<LogOut className='mr-2 h-4 w-4' />
					<span>Desconectar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}