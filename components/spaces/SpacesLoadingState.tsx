import { Skeleton } from '@/components/ui/skeleton'
import { SpacesSpaceSkeletonCard } from './SpacesSpaceSkeletonCard'

export const SpacesLoadingState = () => (
	<div className="main-container">
		<Skeleton className="h-8 w-40 mb-6" />
		{[1, 2, 3].map((i) => (
			<SpacesSpaceSkeletonCard key={i} />
		))}
		<Skeleton className="h-4 w-64 mx-auto mt-8" />
	</div>
)
