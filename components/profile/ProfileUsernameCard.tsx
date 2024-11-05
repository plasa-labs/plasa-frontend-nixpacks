// External imports
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useName } from '@coinbase/onchainkit/identity'
import { baseSepolia } from 'viem/chains'

// Internal imports
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card'

/**
 * ProfileUsernameCard Component
 * 
 * Displays the user's Base username if available, otherwise shows an option to get one.
 * Uses the Base Sepolia network for name resolution.
 * 
 * @returns {JSX.Element} A card component showing username information or registration option
 */
export default function ProfileUsernameCard(): JSX.Element {
	const { address: userAddress } = useAccount()
	const { name: basename } = useName({
		address: userAddress as `0x${string}`,
		chain: baseSepolia,
	})

	return (
		<Card className='mb-6'>
			<CardHeader>
				<CardTitle>Nombre de usuario</CardTitle>
			</CardHeader>
			<CardContent>
				{basename ? (
					<div className='flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white rounded-lg p-4'>
						<h2 className='text-2xl font-bold tracking-tight'>{basename}</h2>
					</div>
				) : (
					<CardDescription>
						El nombre de usuario es opcional y se puede obtener en cualquier momento.
					</CardDescription>
				)}
			</CardContent>
			{!basename && (
				<CardFooter>
					<Button asChild className='w-full'>
						<Link href='https://www.base.org/names'>Obtener nombre de usuario</Link>
					</Button>
				</CardFooter>
			)}
		</Card>
	)
}
