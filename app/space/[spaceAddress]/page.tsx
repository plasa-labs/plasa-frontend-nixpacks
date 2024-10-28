'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAccount, useReadContract } from 'wagmi'

import { SpaceView } from '@/lib/onchain/types/spaces'
import { contractsGetSpace } from '@/lib/onchain/contracts'

import { BackToSpacesButton } from './components/BackToSpacesButton'
import { SpaceHeader } from './components/SpaceHeader'
import { QuestionsList } from './components/QuestionsList'
import { Leaderboard } from './components/Leaderboard'
import { SpaceInfo } from './components/SpaceInfo'
import {
	SpaceHeaderSkeleton,
	QuestionsListSkeleton,
	LeaderboardSkeleton,
	SpaceInfoSkeleton
} from './components/loading'

// Mock data for leaderboard (kept as requested)
const mockLeaderboard = [
	{ name: "alice", points: 8900 },
	{ name: "bob", points: 7500 },
	{ name: "charlie", points: 6200 },
	{ name: "david", points: 5800 },
	{ name: "eva", points: 4900 },
]

export default function SpacePage() {
	const { spaceAddress } = useParams()
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
			<div className="container mx-auto bg-background text-foreground p-6">
				<BackToSpacesButton />
				<SpaceHeaderSkeleton />
				<QuestionsListSkeleton />
				<LeaderboardSkeleton />
				<SpaceInfoSkeleton />
			</div>
		)
	}

	if (isError || !spaceData) {
		return <div>Error loading space data</div>
	}

	const space = spaceData as unknown as SpaceView

	return (
		<div className="container mx-auto bg-background text-foreground p-6">
			<BackToSpacesButton />
			<SpaceHeader
				name={space.data.name}
				description={space.data.description}
				points={BigInt(space.points.user.currentBalance)}
				symbol={space.points.data.symbol}
				imageUrl={space.data.imageUrl}
			/>
			<QuestionsList
				questions={space.questions}
				canCreateQuestion={space.user.permissions.CreateFixedQuestion || space.user.permissions.CreateOpenQuestion}
				spaceAddress={spaceAddress as string}
			/>
			<Leaderboard members={mockLeaderboard} />
			<SpaceInfo
				contractAddress={space.data.contractAddress}
				creationDate={BigInt(space.data.creationTimestamp)}
			/>
		</div>
	)
}
