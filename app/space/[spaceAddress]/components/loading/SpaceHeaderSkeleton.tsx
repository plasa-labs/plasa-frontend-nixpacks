import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SpaceHeaderSkeleton() {
	return (
		<Card className="mb-6">
			<CardHeader>
				<div className="flex items-start">
					<Skeleton className="w-16 h-16 rounded-full mr-4" />
					<div className="flex-grow">
						<Skeleton className="h-8 w-64 mb-2" />
						<Skeleton className="h-4 w-96" />
					</div>
					<Skeleton className="h-6 w-24 ml-4" />
				</div>
			</CardHeader>
		</Card>
	)
}
