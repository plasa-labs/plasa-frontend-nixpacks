import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SpaceInformationSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-48" />
			</CardHeader>
			<CardContent>
				<div className="flex items-center mb-2">
					<Skeleton className="h-4 w-4 mr-2" />
					<Skeleton className="h-4 w-64" />
				</div>
				<div className="flex items-center">
					<Skeleton className="h-4 w-4 mr-2" />
					<Skeleton className="h-4 w-48" />
				</div>
			</CardContent>
		</Card>
	)
}
