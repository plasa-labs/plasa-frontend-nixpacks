'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import FundsTransactionsSearchBar from './FundsTransactionsSearchBar'

interface FundsTransactionsClientSearchProps {
	initialSearchTerm: string
	accountKey: string
}

export default function FundsTransactionsClientSearch({
	initialSearchTerm,
	accountKey
}: FundsTransactionsClientSearchProps) {
	const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	useEffect(() => {
		setSearchTerm(initialSearchTerm)
		setIsLoading(false)
	}, [initialSearchTerm])

	const handleSearch = (term: string) => {
		setIsLoading(true)
		router.push(`/funds/${accountKey}?search=${encodeURIComponent(term)}`)
	}

	const handleReset = () => {
		setSearchTerm('')
		setIsLoading(true)
		router.push(`/funds/${accountKey}`)
	}

	return (
		<FundsTransactionsSearchBar
			onSearch={handleSearch}
			onReset={handleReset}
			isSearchActive={!!searchTerm}
			searchTerm={searchTerm}
		// isLoading={isLoading}
		/>
	)
}

