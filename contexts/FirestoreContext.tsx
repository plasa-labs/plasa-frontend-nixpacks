"use client"

// External imports
import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react'
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
	setUserFirestore: (userData: FirestoreUserData | null) => void
	asyncSetUserFirestore: (userData: FirestoreUserData) => Promise<void>
	updateUserFirestore: (updates: Partial<FirestoreUserData>) => Promise<void>
	instagram: string | null
}

/**
 * Props interface for the FirestoreProvider component
 */
interface FirestoreProviderProps {
	children: ReactNode
}

// Create context with undefined as initial value
const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined)

export function FirestoreProvider({ children }: FirestoreProviderProps) {
	const [userFirestore, setUserFirestore] = useState<FirestoreUserData | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const { user, authenticated } = usePrivy()
	const userAddress = user?.smartWallet?.address as `0x${string}`

	const fetchUserData = useCallback(async () => {
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
			if (data && JSON.stringify(data) !== JSON.stringify(userFirestore)) {
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
	}, [authenticated, userAddress, userFirestore])

	useEffect(() => {
		let mounted = true

		if (authenticated && userAddress) {
			fetchUserData().then(() => {
				if (!mounted) return
			})
		} else {
			setUserFirestore(null)
		}

		return () => {
			mounted = false
		}
	}, [authenticated, userAddress, fetchUserData])

	const updateUserFirestore = async (updates: Partial<FirestoreUserData>): Promise<void> => {
		if (!userFirestore || !userAddress) {
			throw new Error('Cannot update user data: User not initialized')
		}

		try {
			const updatedData = { ...userFirestore, ...updates }
			setUserFirestore(updatedData)
		} catch (err) {
			setIsError(true)
			setError(err as Error)
			console.error('Error updating user data:', err)
			throw err
		}
	}

	const asyncSetUserFirestore = async (userData: FirestoreUserData) => {
		return new Promise<void>((resolve) => {
			setUserFirestore(userData)
			setIsLoading(false)
			// Give time for state updates to propagate
			setTimeout(resolve, 100)
		})
	}

	const value = {
		userFirestore,
		isLoading,
		isError,
		error,
		setUserFirestore,
		asyncSetUserFirestore,
		updateUserFirestore,
		instagram: userFirestore?.instagram_username || null,
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