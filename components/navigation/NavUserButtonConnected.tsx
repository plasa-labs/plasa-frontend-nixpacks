'use client'

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
// import useUsername from '@/app/hooks/useUsername'
import Link from 'next/link'
// import { useTheme } from 'next-themes'
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
// import { Moon, Sun, Laptop } from 'lucide-react'

interface NavUserButtonConnectedProps {
	className?: string
}

export default function NavUserButtonConnected({ className }: NavUserButtonConnectedProps) {
	const { logout } = usePrivy()
	// const displayName = useUsername()
	// const { theme, setTheme } = useTheme()

	const handleDisconnect = async () => {
		await logout()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className={`transition-all duration-200 hover:scale-105 ${className}`}
				>
					<User className="mr-2 h-4 w-4" />
					{/* <span className="max-w-[150px] truncate">{displayName}</span> */}
					<span className="max-w-[150px] truncate">user</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem>
					<User className="mr-2 h-4 w-4" />
					<Link href="/profile">Mi Perfil</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Settings className="mr-2 h-4 w-4" />
					<span>Configuración</span>
				</DropdownMenuItem>
				{/* <DropdownMenuItem>
					<span className="mr-2">Tema:</span>
					<ToggleGroup type="single" value={theme} onValueChange={setTheme} className="flex justify-center space-x-1">
						<ToggleGroupItem value="light" aria-label="Light mode">
							<Sun className="h-4 w-4" />
						</ToggleGroupItem>
						<ToggleGroupItem value="dark" aria-label="Dark mode">
							<Moon className="h-4 w-4" />
						</ToggleGroupItem>
						<ToggleGroupItem value="system" aria-label="System theme">
							<Laptop className="h-4 w-4" />
						</ToggleGroupItem>
					</ToggleGroup>
				</DropdownMenuItem> */}
				<DropdownMenuItem onClick={handleDisconnect} className="text-red-500">
					<LogOut className="mr-2 h-4 w-4" />
					<span>Desconectar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}