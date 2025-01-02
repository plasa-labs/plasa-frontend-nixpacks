import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function SkeletonLoader() {
	return (
		<div className="space-y-4">
			{[...Array(1)].map((_, index) => (
				<Card key={index}>
					<CardContent className="p-4 sm:p-6">
						<div className="flex flex-col space-y-4">
							<Skeleton className="h-6 sm:h-7 w-3/4" />
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div className="flex items-center gap-2">
									<Skeleton className="h-5 w-5" />
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-6 w-24" />
								</div>
								<Skeleton className="h-9 w-full sm:w-32" />
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}

