'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function BackToSpacesButton() {
	return (
		<Link href="/" passHref>
			<Button variant="outline" className="mb-6">
				<ArrowLeft className="mr-2 h-4 w-4" />
				Volver a Espacios
			</Button>
		</Link>
	)
}
