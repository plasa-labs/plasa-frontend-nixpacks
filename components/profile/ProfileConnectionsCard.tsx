// External imports
import { useState } from 'react'
import { Instagram } from 'lucide-react'

// Internal UI component imports
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

// Context imports
import { useFirestore } from '@/contexts/FirestoreContext'

/**
 * Interface for ProfileConnectionsCard component props
 * @property {Function} onConnectInstagram - Callback function to handle Instagram connection
 */
interface ProfileConnectionsCardProps {
	onConnectInstagram: (username: string) => void
}

/**
 * ProfileConnectionsCard Component
 * Displays a card that allows users to connect their Instagram account
 * Shows the connected Instagram username if already connected
 */
export default function ProfileConnectionsCard({ onConnectInstagram }: ProfileConnectionsCardProps) {
	const [instagramUsername, setInstagramUsername] = useState('')
	const { userFirestore } = useFirestore()

	return (
		<Card className='mb-6'>
			<CardHeader>
				<CardTitle>Conexiones</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<Instagram className='text-pink-500' />
						<span className='font-medium'>Instagram</span>
					</div>
					{userFirestore?.instagram ? (
						<p className='text-sm font-medium'>{userFirestore.instagram}</p>
					) : (
						<Dialog>
							<DialogTrigger asChild>
								<Button variant='outline' size='sm'>Conectar</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Conectar Instagram</DialogTitle>
								</DialogHeader>
								<p className='mb-4'>
									La API de Instagram Basic Display requiere que el usuario sea invitado y acepte participar como tester en la plataforma de Meta Developers. Para evitarlo y no pedirles autenticación real, podés ingresar directamente tu nombre de usuario de Instagram.
								</p>
								<Input
									placeholder='Nombre de usuario de Instagram'
									value={instagramUsername}
									onChange={(e) => setInstagramUsername(e.target.value)}
								/>
								<Button onClick={() => onConnectInstagram(instagramUsername)} className='mt-4 w-full'>
									Conectar
								</Button>
							</DialogContent>
						</Dialog>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
