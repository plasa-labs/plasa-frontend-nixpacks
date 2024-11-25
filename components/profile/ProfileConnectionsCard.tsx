// External imports
import { Instagram } from 'lucide-react'

// Internal UI component imports
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ProfileInstagramCodeVerifierDialog, Instructions } from './ProfileInstagramCodeVerifier'

// Context imports
import { useFirestore } from '@/contexts/FirestoreContext'

/**
 * ProfileConnectionsCard Component
 * Displays a card that allows users to connect their Instagram account
 * Shows the connected Instagram username if already connected
 */
export default function ProfileConnectionsCard() {
	const { userFirestore } = useFirestore()

	const instagramUsername = userFirestore?.instagram_username

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
					{instagramUsername ? (
						<p className='text-sm font-medium'>{instagramUsername}</p>
					) : (
						<Dialog>
							<DialogTrigger asChild>
								<Button variant='outline' size='sm'>Conectar</Button>
							</DialogTrigger>
							<DialogContent className="max-w-md flex flex-col items-center">
								<DialogHeader>
									<DialogTitle>Conectar Instagram</DialogTitle>
								</DialogHeader>

								<Instructions />
								<ProfileInstagramCodeVerifierDialog />
							</DialogContent>
						</Dialog>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
