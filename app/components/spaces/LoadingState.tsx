import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonCard } from "./SkeletonCard"

export const LoadingState = () => (
	<div className="min-h-screen">
		<main className="container mx-auto px-4 py-8">
			<Skeleton className="h-8 w-40 mb-6" />
			{[1, 2, 3].map((i) => (
				<SkeletonCard key={i} />
			))}
			<Skeleton className="h-4 w-64 mx-auto mt-8" />
		</main>
	</div>
)
