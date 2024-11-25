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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge'

// Types
interface NavUserButtonConnectedProps {
	className?: string
}

// Contexts
import { usePlasa } from '@/contexts/PlasaContext'
import { useSpace } from '@/contexts/SpaceContext'

// Utils
import { formatPoints } from '@/lib/utils/formatters'

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
	const { plasa, username } = usePlasa()
	const { space } = useSpace()

	if (!plasa || !space || !username) return null

	const points = space.points.points

	const symbol = points.data.symbol
	const balance = points.user.currentBalance

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
					className={`transition-all duration-200 hover:scale-105 ${className} gap-3`}
				>
					{/* <User className='mr-2 h-4 w-4' /> */}
					<Avatar className="h-6 w-6">
						<AvatarImage src={`https://avatar.vercel.sh/${username}.png`} alt={username} />
						<AvatarFallback>{username}</AvatarFallback>
					</Avatar>
					<span className='max-w-[150px] truncate'>{username}</span>
					<Badge variant="secondary" className="px-3 py-1 whitespace-nowrap">
						{formatPoints(balance)} {symbol}
					</Badge>
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