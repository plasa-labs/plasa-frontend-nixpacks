import { Card, CardContent } from '@/components/ui/card'

/**
 * ProfileNotConnectedCard Component
 * 
 * Displays a card with a message prompting users to connect their account
 * to view their profile. Used as a placeholder when user is not authenticated.
 */
export default function ProfileNotConnectedCard() {
	return (
		<div className='main-container'>
			<Card className='w-full max-w-md mx-auto mt-8'>
				<CardContent className='pt-6'>
					<p className='text-center'>Conectá tu cuenta para ver tu perfil.</p>
				</CardContent>
			</Card>
		</div >
	)
}
