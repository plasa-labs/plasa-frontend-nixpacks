'use client'

// External imports
import Image from 'next/image'
import Link from 'next/link'

// Internal UI components
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'

// Types
import { SpacePreview } from '@/lib/onchain/types/interfaces'

// Component props interface
interface SpaceCardProps {
	space: SpacePreview
}

/**
 * SpaceCard Component
 * 
 * Displays a card with space information including an image, name, description,
 * and an entry button. Used in the spaces list view.
 *
 * @param {SpaceCardProps} props - Component properties
 * @param {SpacePreview} props.space - Space data to display
 * @returns {JSX.Element} Rendered card component
 */
export default function SpaceCard({ space }: SpaceCardProps) {
	return (
		<Card className='mb-4'>
			<div className='flex items-center p-4'>
				<div className='w-16 h-16 mr-4 overflow-hidden rounded-lg relative flex-shrink-0'>
					<Image
						src={space.data.imageUrl}
						alt={space.data.name}
						width={64}
						height={64}
						className='object-cover'
					/>
				</div>
				<div className='flex-grow'>
					<CardTitle className='mb-2'>{space.data.name}</CardTitle>
					<p className='text-sm text-gray-600'>{space.data.description}</p>
				</div>
				<Link href={`/space/${space.data.contractAddress}`} passHref>
					<Button className='ml-4'>Entrar</Button>
				</Link>
			</div>
		</Card>
	)
}
