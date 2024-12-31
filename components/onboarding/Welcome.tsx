// External dependencies
import { Poppins } from 'next/font/google'

// Font configuration
const poppins = Poppins({
	weight: ['400', '700', '900'],
	subsets: ['latin']
})

export default function Welcome() {
	return (
		<div className="flex-1 flex items-center justify-center bg-background">
			<div className="text-center">
				<h1 className={`mb-2 text-4xl ${poppins.className}`}>D&D</h1>
				<p className="mb-8 text-xl text-muted-foreground">
					No hacemos caridad
				</p>
			</div>
		</div>
	)
}

