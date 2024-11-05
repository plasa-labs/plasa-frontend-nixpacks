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

/**
 * SpaceProvider component that manages the space state and provides it to children
 * @param {SpaceProviderProps} props - The component props
 * @returns {JSX.Element} Provider component wrapping children
 */
function SpaceProvider({ children }: SpaceProviderProps): JSX.Element {
	const [space, setSpace] = useState<SpaceView | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const { user } = usePrivy()

	const userAddress = user?.smartWallet?.address as `0x${string}`

	const spaceAddress = process.env.NEXT_PUBLIC_SPACE_ADDRESS as `0x${string}`

	const contract = contractsGetSpace(spaceAddress, userAddress)
	const { data: spaceData, isLoading: isLoadingContract, isError: isErrorContract, error: contractError, refetch: contractRefetch } = useReadContract(contract)

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
		refetch: contractRefetch,
		setSpace
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