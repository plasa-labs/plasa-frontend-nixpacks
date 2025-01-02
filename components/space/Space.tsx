'use client'

// External imports
import { useSpace } from '@/contexts/SpaceContext'

// Internal imports - components
// import SpaceHeader from './SpaceHeader'
import SpaceQuestionsList from './SpaceQuestionsList'
import SpaceLeaderboard from './SpaceLeaderboard'
// import SpaceInformation from './SpaceInformation'
import SpaceFundsListClient from './SpaceFundsListClient'
import {
	// SpaceHeaderSkeleton,
	SpaceQuestionsListSkeleton,
	SpaceLeaderboardSkeleton,
	// SpaceInformationSkeleton,
	SpaceFundsListSkeleton
} from './loading'

// /**
//  * Props interface for the Space component
//  * @interface SpaceProps
//  * @property {string} [spaceAddress] - Optional address of the space
//  */
// interface SpaceProps {
// 	spaceAddress?: string
// }

// export default function Space({ }: SpaceProps) {
export default function Space() {
	// Fetch space data using context
	const { isLoading, isError, error } = useSpace()

	if (isLoading) {
		return (
			<div className='main-container'>
				{/* <SpaceHeaderSkeleton /> */}
				<SpaceFundsListSkeleton />
				<SpaceQuestionsListSkeleton />
				<SpaceLeaderboardSkeleton />
				{/* <SpaceInformationSkeleton /> */}
			</div>
		)
	}

	if (isError) {
		return (
			<div className='main-container'>
				<div className='p-4 text-center'>
					<h2 className='text-xl font-semibold mb-2'>Error Loading Space</h2>
					<p className='text-gray-600'>
						{error instanceof Error
							? error.message
							: 'Unable to load space data. Please try again later.'}
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className='main-container space-y-8'>
			{/* <SpaceHeader /> */}
			<SpaceFundsListClient />
			<SpaceQuestionsList />
			<SpaceLeaderboard />
			{/* <SpaceInformation /> */}
		</div>
	)
} 