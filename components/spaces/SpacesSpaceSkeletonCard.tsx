'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * SpacesSpaceSkeletonCard
 * 
 * A loading skeleton component that represents a space card in the spaces list.
 * Displays placeholder animations for the space's avatar, title, description,
 * and action button while content is being loaded.
 */
export default function SpacesSpaceSkeletonCard() {
	return (
		<Card className='mb-4'>
			<div className='flex items-center p-4'>
				{/* Space avatar placeholder */}
				<Skeleton className='w-16 h-16 mr-4 rounded-lg' />

				{/* Title and description container */}
				<div className='flex-grow'>
					<Skeleton className='h-6 w-3/4 mb-2' />
					<Skeleton className='h-4 w-full' />
				</div>

				{/* Action button placeholder */}
				<Skeleton className='h-10 w-20' />
			</div>
		</Card>
	)
}
