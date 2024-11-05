import { Skeleton } from '@/components/ui/skeleton'
import SpacesSpaceSkeletonCard from './SpacesSpaceSkeletonCard'

/**
 * SpacesLoadingState - A loading state component for the Spaces section
 * Displays a skeleton layout while content is being fetched
 * 
 * Renders:
 * - A header skeleton
 * - Three space card skeletons
 * - A footer skeleton (likely for pagination or additional info)
 */
export default function SpacesLoadingState() {
	return (
		<div className='main-container'>
			<Skeleton className='h-8 w-40 mb-6' />
			{[1, 2, 3].map((i) => (
				<SpacesSpaceSkeletonCard key={i} />
			))}
			<Skeleton className='h-4 w-64 mx-auto mt-8' />
		</div>
	)
}
