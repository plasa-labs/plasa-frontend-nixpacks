import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * SpaceQuestionsListSkeleton
 * 
 * A loading skeleton component that displays a placeholder UI while the actual
 * questions list is being fetched. It shows a card containing two skeleton
 * question items with headers and content areas.
 * 
 * @returns {JSX.Element} A skeleton loading state for the questions list
 */
export default function SpaceQuestionsListSkeleton() {
	return (
		<Card className='mb-6'>
			<CardHeader>
				<div className='flex justify-between items-center'>
					<Skeleton className='h-6 w-24' />
					<Skeleton className='h-9 w-36' />
				</div>
			</CardHeader>
			<CardContent>
				{[1, 2].map((_, index) => (
					<div key={index} className='mb-4 p-4 border rounded-lg'>
						<div className='flex justify-between items-start mb-2'>
							<div>
								<Skeleton className='h-5 w-64 mb-2' />
								<Skeleton className='h-4 w-40' />
							</div>
							<div className='flex flex-col items-end'>
								<Skeleton className='h-6 w-16 mb-2' />
								<Skeleton className='h-8 w-20' />
							</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
