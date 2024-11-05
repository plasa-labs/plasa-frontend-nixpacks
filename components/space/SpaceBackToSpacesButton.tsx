'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

/**
 * SpaceBackToSpacesButton Component
 * 
 * A navigation button component that redirects users back to the spaces overview page.
 * Includes a left arrow icon and "Volver a Espacios" (Back to Spaces) text.
 */
export default function SpaceBackToSpacesButton() {
	return (
		<Link href="/" passHref>
			<Button variant="outline" className="mb-6">
				<ArrowLeft className="mr-2 h-4 w-4" />
				Volver a Espacios
			</Button>
		</Link>
	)
}
