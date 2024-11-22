"use client"

// External imports
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'

// Internal imports
import type { FirestoreUserData } from '@/lib/api/interfaces'
import { fetchUser } from '@/lib/api/endpoints'

/**
 * Interface defining the shape of the Firestore context
 */
interface FirestoreContextType {
	userFirestore: FirestoreUserData | null
	isLoading: boolean
	isError: boolean
	error: Error | null
	refetch: () => Promise<void>
	setUserFirestore: (userData: FirestoreUserData) => void
	updateUserFirestore: (updates: Partial<FirestoreUserData>) => Promise<void>
}

/**
 * Props interface for the FirestoreProvider component
 */
interface FirestoreProviderProps {
	children: ReactNode
}

// Create context with undefined as initial value
const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined)

/**
 * FirestoreProvider component that manages user data state and provides
 * methods to interact with Firestore data throughout the application.
 *
 * @component
 * @param {FirestoreProviderProps} props - The component props
 * @returns {JSX.Element} Provider component wrapping children with Firestore context
 */
export function FirestoreProvider({ children }: FirestoreProviderProps) {
	const [userFirestore, setUserFirestore] = useState<FirestoreUserData | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const { user, authenticated } = usePrivy()
	const userAddress = user?.smartWallet?.address as `0x${string}`

	const fetchUserData = async () => {
		if (!authenticated || !userAddress) {
			setIsLoading(false)
			return
		}

		if (userFirestore?.user_id === userAddress) {
			setIsLoading(false)
			return
		}

		setIsLoading(true)
		try {
			const data = await fetchUser(userAddress)
			if (JSON.stringify(data) !== JSON.stringify(userFirestore)) {
				setUserFirestore(data)
				setIsError(false)
				setError(null)
			}
		} catch (err) {
			setIsError(true)
			setError(err as Error)
			console.error('Error fetching user data:', err)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (authenticated && userAddress) {
			fetchUserData()
		} else {
			// Reset user data when not authenticated
			setUserFirestore(null)
		}
	}, [authenticated, userAddress])

	const updateUserFirestore = async (updates: Partial<FirestoreUserData>) => {
		if (!userFirestore) return

		try {
			const updatedData = { ...userFirestore, ...updates }
			setUserFirestore(updatedData)
		} catch (err) {
			setIsError(true)
			setError(err as Error)
			console.error('Error updating user data:', err)
		}
	}

	const value = {
		userFirestore,
		isLoading,
		isError,
		error,
		refetch: fetchUserData,
		setUserFirestore,
		updateUserFirestore
	}

	return <FirestoreContext.Provider value={value}>{children}</FirestoreContext.Provider>
}

/**
 * Custom hook to access the Firestore context
 *
 * @throws {Error} If used outside of FirestoreProvider
 * @returns {FirestoreContextType} The Firestore context value
 */
export function useFirestore() {
	const context = useContext(FirestoreContext)
	if (context === undefined) {
		throw new Error('useFirestore must be used within a FirestoreProvider')
	}
	return context
} 