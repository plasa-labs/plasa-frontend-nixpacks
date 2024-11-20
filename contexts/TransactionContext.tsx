'use client'

import { createContext, useContext, useState } from 'react'

interface TransactionContextType {
	isAnyTransactionProcessing: boolean
	setIsAnyTransactionProcessing: (processing: boolean) => void
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export function TransactionProvider({ children }: { children: React.ReactNode }) {
	const [isAnyTransactionProcessing, setIsAnyTransactionProcessing] = useState(false)

	return (
		<TransactionContext.Provider value={{ isAnyTransactionProcessing, setIsAnyTransactionProcessing }}>
			{children}
		</TransactionContext.Provider>
	)
}

export function useTransaction() {
	const context = useContext(TransactionContext)
	if (context === undefined) {
		throw new Error('useTransaction must be used within a TransactionProvider')
	}
	return context
}