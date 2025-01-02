'use client'

import { useState, useEffect } from 'react'
import SpaceFundsList from './SpaceFundsList'
import { fetchAccounts } from '@/lib/api/funds'
import { AccountInfo } from '@/lib/types'
import SkeletonLoader from '@/components/space/loading/SpaceFundsListSkeleton'

export default function SpaceFundsListClient() {
	const [accounts, setAccounts] = useState<AccountInfo[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		const loadAccounts = async () => {
			setIsLoading(true)
			try {
				const data = await fetchAccounts()
				setAccounts(data)
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Failed to fetch accounts'))
			} finally {
				setIsLoading(false)
			}
		}

		loadAccounts()
	}, [])

	if (isLoading) {
		return <SkeletonLoader />
	}

	if (error) {
		return (
			<div className="text-center py-4">
				<p className="text-red-500">Error: {error.message}</p>
			</div>
		)
	}

	return <SpaceFundsList accounts={accounts} />
}