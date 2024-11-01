'use client'

import { useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'

import { SpaceView } from '@/lib/onchain/types/spaces'
import { contractsGetSpace } from '@/lib/onchain/contracts'

// import { SpaceBackToSpacesButton } from './SpaceBackToSpacesButton'
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

// Mock data for leaderboard (kept as requested)
const mockLeaderboard = [
	{ name: "alice", points: 8900 },
	{ name: "bob", points: 7500 },
	{ name: "charlie", points: 6200 },
	{ name: "david", points: 5800 },
	{ name: "eva", points: 4900 },
]

interface SpaceProps {
	spaceAddress: string
}

export function Space({ spaceAddress }: SpaceProps) {
	const { address: userAddress } = useAccount()

	const contract = contractsGetSpace(spaceAddress as `0x${string}`, userAddress as `0x${string}`)

	const { data: spaceData, isLoading, isError, error } = useReadContract(contract)

	useEffect(() => {
		if (spaceData) {
			console.log('Space data:', spaceData)
		}
	}, [spaceData])

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

	if (isError || !spaceData) {
		console.error('Error loading space data:', error)
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

	const space = spaceData as unknown as SpaceView

	return (
		<div className="main-container">
			{/* <SpaceBackToSpacesButton /> */}
			<SpaceHeader
				name={space.data.name}
				description={space.data.description}
				points={BigInt(space.points.user.currentBalance)}
				symbol={space.points.data.symbol}
				imageUrl={space.data.imageUrl}
			/>
			<SpaceQuestionsList
				questions={space.questions}
				canCreateQuestion={space.user.permissions.CreateFixedQuestion || space.user.permissions.CreateOpenQuestion}
				spaceAddress={spaceAddress}
			/>
			<SpaceLeaderboard members={mockLeaderboard} />
			<SpaceInformation
				contractAddress={space.data.contractAddress}
				creationDate={BigInt(space.data.creationTimestamp)}
			/>
		</div>
	)
} 