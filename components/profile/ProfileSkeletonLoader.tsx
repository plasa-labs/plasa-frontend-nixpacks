import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * ProfileSkeletonLoader Component
 * 
 * A loading placeholder component that displays a skeleton structure of the profile page.
 * Uses skeleton animations to indicate loading state for various profile sections including:
 * - Profile header
 * - User information cards
 * - Gallery sections
 */
export default function ProfileSkeletonLoader() {
	return (
		<div className='mx-auto px-4 py-8'>
			{/* Profile Header Skeleton */}
			<Skeleton className='h-10 w-48 mb-6' />

			<div className='grid gap-6 md:grid-cols-2'>
				{/* Left Column - User Info Cards */}
				<div>
					{/* User Details Card */}
					<Card className='mb-6'>
						<CardHeader>
							<Skeleton className='h-6 w-36' />
						</CardHeader>
						<CardContent>
							<Skeleton className='h-16 w-full rounded-lg' />
						</CardContent>
					</Card>

					{/* User Stats Card */}
					<Card className='mb-6'>
						<CardHeader>
							<Skeleton className='h-6 w-36' />
						</CardHeader>
						<CardContent>
							<div className='flex items-center justify-between'>
								<Skeleton className='h-6 w-24' />
								<Skeleton className='h-8 w-20' />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Gallery Card */}
				<Card>
					<CardHeader>
						<Skeleton className='h-6 w-24' />
					</CardHeader>
					<CardContent>
						{/* First Gallery Section */}
						<Skeleton className='h-5 w-32 mb-2' />
						<div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6'>
							<Skeleton className='h-32 w-full' />
							<Skeleton className='h-32 w-full' />
							<Skeleton className='h-32 w-full' />
						</div>

						{/* Second Gallery Section */}
						<Skeleton className='h-5 w-40 mb-2' />
						<div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
							<Skeleton className='h-32 w-full' />
							<Skeleton className='h-32 w-full' />
							<Skeleton className='h-32 w-full' />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
