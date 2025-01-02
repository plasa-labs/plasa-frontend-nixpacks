"use client"

// External dependencies
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useReadContract } from 'wagmi'

// Internal dependencies
import { SpaceView } from '@/lib/onchain/types/interfaces'
import { contractsGetSpace } from '@/lib/onchain/contracts'

/**
 * Interface defining the shape of the Space context
 * @interface SpaceContextType
 */
interface SpaceContextType {
	space: SpaceView | null
	isLoading: boolean
	isError: boolean
	error: Error | null
	refetch: () => void
	setSpace: (space: SpaceView) => void
	updateSpace: (partial: Partial<SpaceView>) => void
}

/**
 * Props interface for the SpaceProvider component
 * @interface SpaceProviderProps
 */
interface SpaceProviderProps {
	children: ReactNode
}

// Create context with undefined as initial value
const SpaceContext = createContext<SpaceContextType | undefined>(undefined)

function SpaceProvider({ children }: SpaceProviderProps) {
	const [space, setSpace] = useState<SpaceView | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [isInitializing, setIsInitializing] = useState(true)

	const { user, authenticated } = usePrivy()

	const userAddress = user?.smartWallet?.address as `0x${string}`

	const spaceAddress = process.env.NEXT_PUBLIC_SPACE_ADDRESS
	if (!spaceAddress) {
		throw new Error('NEXT_PUBLIC_SPACE_ADDRESS is not defined')
	}
	const typedSpaceAddress = spaceAddress as `0x${string}`

	const contract = contractsGetSpace(typedSpaceAddress, userAddress)
	const { data: spaceData, isLoading: isLoadingContract, isError: isErrorContract, error: contractError, refetch: contractRefetch } = useReadContract(contract)

	useEffect(() => {
		if (spaceData) {
			try {
				const serializedSpaceData = JSON.parse(JSON.stringify(spaceData, (_, value) =>
					typeof value === 'bigint' ? value.toString() : value
				))
				const serializedSpace = space ? JSON.parse(JSON.stringify(space, (_, value) =>
					typeof value === 'bigint' ? value.toString() : value
				)) : null

				if (JSON.stringify(serializedSpaceData) !== JSON.stringify(serializedSpace)) {
					const newSpace = spaceData as unknown as SpaceView
					setSpace(newSpace)
				}
			} catch (err) {
				setError(err as Error)
				setIsError(true)
			}
		}
		if (isLoadingContract !== isLoading) setIsLoading(isLoadingContract)
		if (isErrorContract !== isError) setIsError(isErrorContract)
		if (contractError !== error) setError(contractError as Error | null)
	}, [spaceData, isLoadingContract, isErrorContract, contractError, space])

	useEffect(() => {
		if (authenticated) {
			contractRefetch()
		}
	}, [authenticated, contractRefetch])

	useEffect(() => {
		if (authenticated && !isLoadingContract) {
			setIsInitializing(false)
		}
	}, [authenticated, isLoadingContract])

	const updateSpace = (partial: Partial<SpaceView>) => {
		setSpace(currentSpace => {
			if (!currentSpace) return null
			return { ...currentSpace, ...partial }
		})
	}

	const value = {
		space,
		isLoading,
		isError,
		error,
		refetch: contractRefetch,
		setSpace,
		updateSpace
	}

	return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
}

/**
 * Custom hook to access the space context
 * @throws {Error} If used outside of SpaceProvider
 * @returns {SpaceContextType} The space context value
 */
function useSpace(): SpaceContextType {
	const context = useContext(SpaceContext)
	if (context === undefined) {
		throw new Error('useSpace must be used within a SpaceProvider')
	}
	return context
}

export { SpaceProvider, useSpace } 