// External dependencies
import { Poppins } from 'next/font/google'

// Internal dependencies
import ConnectButton from '@/components/common/ConnectButton'

// Font configuration
const poppins = Poppins({
	weight: ['400', '700', '900'],
	subsets: ['latin']
})

/**
 * Welcome Component
 * 
 * Renders the initial welcome screen with a title, tagline, and connection button.
 * Serves as the entry point for user onboarding.
 * 
 * @returns {JSX.Element} The rendered Welcome component
 */
export default function Welcome(): JSX.Element {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background">
			<h1 className={`mb-2 text-4xl ${poppins.className}`}>D&D</h1>
			<p className="mb-8 text-xl text-muted-foreground">
				No hacemos caridad
			</p>
			<ConnectButton />
		</div>
	)
}

