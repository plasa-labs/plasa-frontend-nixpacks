"use client"

// External dependencies
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useReadContract } from 'wagmi'

// Internal dependencies
import { contractsGetPlasa } from '@/lib/onchain/contracts'
import { abbreviateAddress } from '@/lib/utils/formatters'
import { PlasaView } from '@/lib/onchain/types/interfaces'

/**
 * Interface defining the shape of the Plasa context
 */
interface PlasaContextType {
	plasa: PlasaView | null
	username: string | null
	isRegistered: boolean
	isLoading: boolean
	isError: boolean
	error: Error | null
	refetch: () => void
	setUsername: (username: string) => void
}

/**
 * Props interface for the PlasaProvider component
 */
interface PlasaProviderProps {
	children: ReactNode
}

// Create context with undefined as initial value
const PlasaContext = createContext<PlasaContextType | undefined>(undefined)

function PlasaProvider({ children }: PlasaProviderProps) {
	const [username, setUsername] = useState<string | null>(null)
	const [plasa, setPlasa] = useState<PlasaView | null>(null)
	const [isRegistered, setIsRegistered] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const { user, authenticated } = usePrivy()
	const userAddress = user?.smartWallet?.address as `0x${string}`

	const contract = contractsGetPlasa(userAddress)
	const {
		data: plasaData,
		isLoading: isLoadingContract,
		isError: isErrorContract,
		error: contractError,
		refetch: contractRefetch
	} = useReadContract(contract) as {
		data: PlasaView
		isLoading: boolean
		isError: boolean
		error: Error | null
		refetch: () => void
	}

	// Log initial contract data
	useEffect(() => {
		if (plasaData) {
			setPlasa(plasaData)
		}
	}, [plasaData])

	// Log loading and error states
	useEffect(() => {
		setIsLoading(isLoadingContract)
		setIsError(isErrorContract)
		setError(contractError as Error | null)
	}, [isLoadingContract, isErrorContract, contractError])

	// Log registration and username updates
	useEffect(() => {
		if (plasa) {
			setIsRegistered(plasa.user.isRegistered)
			setUsername(plasa.user.username)
		}
	}, [plasa])

	// Log authentication and refetch
	useEffect(() => {
		if (authenticated) {
			contractRefetch()
		}
	}, [authenticated, contractRefetch])

	const value = {
		plasa,
		username,
		isRegistered,
		isLoading,
		isError,
		error,
		refetch: contractRefetch,
		setUsername
	}

	return (
		<PlasaContext.Provider value={value}>
			{children}
		</PlasaContext.Provider>
	)
}

/**
 * Custom hook to use the Plasa context
 * @returns {PlasaContextType} The Plasa context
 */
function usePlasa(): PlasaContextType {
	const context = useContext(PlasaContext)
	if (context === undefined) {
		throw new Error('usePlasa must be used within a PlasaProvider')
	}
	return context
}

export { PlasaProvider, usePlasa }
