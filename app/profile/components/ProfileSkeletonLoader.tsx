import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ProfileSkeletonLoader() {
	return (
		<div className="container mx-auto px-4 py-8">
			<Skeleton className="h-10 w-48 mb-6" />
			<div className="grid gap-6 md:grid-cols-2">
				<div>
					<Card className="mb-6">
						<CardHeader>
							<Skeleton className="h-6 w-36" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-16 w-full rounded-lg" />
						</CardContent>
					</Card>
					<Card className="mb-6">
						<CardHeader>
							<Skeleton className="h-6 w-36" />
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<Skeleton className="h-6 w-24" />
								<Skeleton className="h-8 w-20" />
							</div>
						</CardContent>
					</Card>
				</div>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-24" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-5 w-32 mb-2" />
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
						</div>
						<Skeleton className="h-5 w-40 mb-2" />
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
