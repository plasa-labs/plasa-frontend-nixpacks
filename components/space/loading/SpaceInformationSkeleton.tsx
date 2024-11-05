import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * SpaceInformationSkeleton
 * 
 * A loading placeholder component that displays a skeleton structure for space information.
 * Uses skeleton elements to indicate loading state for title and two rows of information.
 * 
 * @returns JSX.Element - A card containing skeleton elements for loading state
 */
export default function SpaceInformationSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className='h-6 w-48' />
			</CardHeader>
			<CardContent>
				<div className='flex items-center mb-2'>
					<Skeleton className='h-4 w-4 mr-2' />
					<Skeleton className='h-4 w-64' />
				</div>
				<div className='flex items-center'>
					<Skeleton className='h-4 w-4 mr-2' />
					<Skeleton className='h-4 w-48' />
				</div>
			</CardContent>
		</Card>
	)
}
