"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { SpaceView } from '@/lib/onchain/types/interfaces'
import { useAccount, useReadContract } from 'wagmi'
import { contractsGetSpace } from '@/lib/onchain/contracts'

interface SpaceContextType {
	space: SpaceView | null
	isLoading: boolean
	isError: boolean
	error: Error | null
	refetch: () => void
	setSpace: (space: SpaceView) => void
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined)

export function SpaceProvider({ children }: { children: ReactNode }) {
	const [space, setSpace] = useState<SpaceView | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const { address: userAddress } = useAccount()
	const spaceAddress = process.env.NEXT_PUBLIC_SPACE_ADDRESS as `0x${string}`

	const contract = contractsGetSpace(spaceAddress, userAddress)
	const { data: spaceData, isLoading: isLoadingContract, isError: isErrorContract, error: contractError } = useReadContract(contract)

	useEffect(() => {
		if (spaceData) {
			const space = spaceData as unknown as SpaceView
			setSpace(space)
		}
		setIsLoading(isLoadingContract)
		setIsError(isErrorContract)
		setError(contractError as Error | null)
	}, [spaceData, isLoadingContract, isErrorContract, contractError])

	const value = {
		space,
		isLoading,
		isError,
		error,
		refetch: () => { },
		setSpace
	}

	return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
}

export function useSpace() {
	const context = useContext(SpaceContext)
	if (context === undefined) {
		throw new Error('useSpace must be used within a SpaceProvider')
	}
	return context
} 