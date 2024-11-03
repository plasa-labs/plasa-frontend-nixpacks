'use client'

import { useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { SpaceView } from '@/lib/onchain/types/interfaces'

import { contractsGetSpace } from '@/lib/onchain/contracts'
import { SpaceProvider } from '@/contexts/SpaceContext'

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
import { ReadContractParameters } from 'viem'

interface SpaceProps {
	spaceAddress: string
}

export function Space({ spaceAddress }: SpaceProps) {
	const { address: userAddress } = useAccount()

	const contract: ReadContractParameters = contractsGetSpace(spaceAddress as `0x${string}`, userAddress)

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
		<SpaceProvider value={{ space, isLoading, isError, error }}>
			<div className="main-container">
				<SpaceHeader />
				<SpaceQuestionsList />
				<SpaceLeaderboard />
				<SpaceInformation />
			</div>
		</SpaceProvider>
	)
} 