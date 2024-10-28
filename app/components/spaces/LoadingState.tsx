import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonCard } from "./SkeletonCard"

export const LoadingState = () => (
	<div className="main-container">
		<Skeleton className="h-8 w-40 mb-6" />
		{[1, 2, 3].map((i) => (
			<SkeletonCard key={i} />
		))}
		<Skeleton className="h-4 w-64 mx-auto mt-8" />
	</div>
)
