"use client"

// External dependencies
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useReadContract } from 'wagmi'

// Internal dependencies
import { contractsGetUserName } from '@/lib/onchain/contracts'
import { abbreviateAddress } from '@/lib/utils/formatters'

/**
 * Interface defining the shape of the Plasa context
 */
interface PlasaContextType {
	username: string | null
	isLoading: boolean
	isError: boolean
	error: Error | null
	refetch: () => void
	setUsername: (username: string) => void
	displayName: string
}

/**
 * Props interface for the PlasaProvider component
 */
interface PlasaProviderProps {
	children: ReactNode
}

// Create context with undefined as initial value
const PlasaContext = createContext<PlasaContextType | undefined>(undefined)

/**
 * PlasaProvider component that manages the username state and provides it to children
 * @param {PlasaProviderProps} props - The component props
 * @returns {JSX.Element} Provider component wrapping children
 */
function PlasaProvider({ children }: PlasaProviderProps): JSX.Element {
	const [username, setUsername] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const { user, authenticated } = usePrivy()
	const userAddress = user?.smartWallet?.address as `0x${string}`

	// Initialize displayName with a default value
	const [displayName, setDisplayName] = useState<string>('displayname')

	// Update displayName whenever userAddress changes
	useEffect(() => {
		if (username) {
			setDisplayName(username)
		} else if (userAddress) {
			setDisplayName(abbreviateAddress(userAddress))
		}
	}, [userAddress, username])

	const contract = contractsGetUserName(userAddress)
	const {
		data: usernameData,
		isLoading: isLoadingContract,
		isError: isErrorContract,
		error: contractError,
		refetch: contractRefetch
	} = useReadContract(contract)

	useEffect(() => {
		if (usernameData) {
			const newUsername = usernameData as string
			if (!newUsername.trim()) {
				setUsername(null)
			} else if (newUsername !== username) {
				setUsername(newUsername)
			}
		}
		if (isLoadingContract !== isLoading) setIsLoading(isLoadingContract)
		if (isErrorContract !== isError) setIsError(isErrorContract)
		if (contractError !== error) setError(contractError as Error | null)
	}, [usernameData, isLoadingContract, isErrorContract, contractError, userAddress, username])

	useEffect(() => {
		if (authenticated) {
			contractRefetch()
		}
	}, [authenticated, contractRefetch])

	const value = {
		username,
		isLoading,
		isError,
		error,
		refetch: contractRefetch,
		setUsername,
		displayName
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
