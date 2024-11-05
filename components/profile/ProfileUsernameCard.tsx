// External imports
import { useAccount } from 'wagmi'
import { useName } from '@coinbase/onchainkit/identity'
import { baseSepolia } from 'viem/chains'

// Internal imports
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import ProfileUsernameMinter from './ProfileUsernameMinter'

// Contexts
import { usePlasa } from '@/contexts/PlasaContext'

/**
 * ProfileUsernameCard Component
 * 
 * Displays the user's Base username if available, otherwise shows an option to get one.
 * Uses the Base Sepolia network for name resolution.
 * 
 * @returns {JSX.Element} A card component showing username information or registration option
 */
export default function ProfileUsernameCard(): JSX.Element {
	const { username } = usePlasa()

	return (
		<Card className='mb-6'>
			<CardHeader>
				<CardTitle>Nombre de usuario</CardTitle>
			</CardHeader>
			<CardContent>
				{username ? (
					<div className='flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white rounded-lg p-4'>
						<h2 className='text-2xl font-bold tracking-tight'>{username}</h2>
					</div>
				) : (
					<ProfileUsernameMinter />
				)}
			</CardContent>
		</Card>
	)
}

