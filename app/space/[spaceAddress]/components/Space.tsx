'use client'

import { useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'

import { SpaceView } from '@/lib/onchain/types/spaces'
import { contractsGetSpace } from '@/lib/onchain/contracts'

import { SpaceBackToSpacesButton } from './SpaceBackToSpacesButton'
import { SpaceHeader } from './SpaceHeader'
import { SpaceQuestionsList } from './SpaceQuestionsList'
import { SpaceLeaderboard } from './SpaceLeaderboard'
import { SpaceInfo } from './SpaceInfo'
import {
	SpaceHeaderSkeleton,
	SpaceQuestionsListSkeleton,
	SpaceLeaderboardSkeleton,
	SpaceInfoSkeleton
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
	const { data: spaceData, isLoading, isError } = useReadContract(contract)

	useEffect(() => {
		if (spaceData) {
			console.log('Space data:', spaceData)
		}
	}, [spaceData])

	if (isLoading) {
		return (
			<div className="main-container">
				<SpaceBackToSpacesButton />
				<SpaceHeaderSkeleton />
				<SpaceQuestionsListSkeleton />
				<SpaceLeaderboardSkeleton />
				<SpaceInfoSkeleton />
			</div>
		)
	}

	if (isError || !spaceData) {
		return <div>Error loading space data</div>
	}

	const space = spaceData as unknown as SpaceView

	return (
		<div className="main-container">
			<SpaceBackToSpacesButton />
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
			<SpaceInfo
				contractAddress={space.data.contractAddress}
				creationDate={BigInt(space.data.creationTimestamp)}
			/>
		</div>
	)
} 