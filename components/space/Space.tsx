'use client'

import { useSpace } from '@/contexts/SpaceContext'
import { SpaceHeader } from './SpaceHeader'
import { SpaceQuestionsList } from './SpaceQuestionsList'
import { SpaceLeaderboard } from './SpaceLeaderboard'
import { SpaceInformation } from './SpaceInformation'
import {
	SpaceHeaderSkeleton,
	SpaceQuestionsListSkeleton,
	SpaceLeaderboardSkeleton,
	SpaceInformationSkeleton
} from './loading'

interface SpaceProps {
	spaceAddress?: string
}

export function Space({ spaceAddress }: SpaceProps) {
	if (spaceAddress) console.log(spaceAddress)

	const { isLoading, isError, error } = useSpace()

	if (isLoading) {
		return (
			<div className="main-container">
				<SpaceHeaderSkeleton />
				<SpaceQuestionsListSkeleton />
				<SpaceLeaderboardSkeleton />
				<SpaceInformationSkeleton />
			</div>
		)
	}

	if (isError) {
		return (
			<div className="main-container">
				<div className="p-4 text-center">
					<h2 className="text-xl font-semibold mb-2">Error Loading Space</h2>
					<p className="text-gray-600">
						{error instanceof Error
							? error.message
							: 'Unable to load space data. Please try again later.'}
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="main-container">
			<SpaceHeader />
			<SpaceQuestionsList />
			<SpaceLeaderboard />
			<SpaceInformation />
		</div>
	)
} 