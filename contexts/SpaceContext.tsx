import { createContext, useContext } from 'react'
import { SpaceView } from '@/lib/onchain/types/spaces'

interface SpaceContextType {
	space: SpaceView
	isLoading: boolean
	isError: boolean
	error: Error | null
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined)

export function SpaceProvider({ children, value }: { children: React.ReactNode; value: SpaceContextType }) {
	return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
}

export function useSpace() {
	const context = useContext(SpaceContext)
	if (context === undefined) {
		throw new Error('useSpace must be used within a SpaceProvider')
	}
	return context
} 