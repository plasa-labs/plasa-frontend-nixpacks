import { Suspense } from 'react'
import { fetchAccountData } from '@/lib/api/funds'
import Funds from '@/components/funds/Funds'
import TransactionsTableServer from './components/FundsTransactionTableServer'
import FundsTransactionsSkeletonLoader from '@/components/funds/FundsTransactionsSkeletonLoader'
import FundsErrorDisplay from '@/components/funds/FundsErrorDisplay'

interface FundsPageProps {
	params: Promise<{ key: string }>
	searchParams: Promise<{ page?: string; lastTransactionId?: string; search?: string }>
}

export default async function FundsPage({
	params,
	searchParams
}: FundsPageProps) {
	const { key } = await params
	const searchParamsResolved = await searchParams
	const page = searchParamsResolved.page ? parseInt(searchParamsResolved.page, 10) : 1
	const searchTerm = searchParamsResolved.search

	try {
		const accountData = await fetchAccountData(key)
		const mercadoPagoId = accountData.account.id

		return (
			<Funds
				accountData={accountData}
				accountKey={key}
				searchTerm={searchTerm}
			>
				<Suspense fallback={<FundsTransactionsSkeletonLoader />}>
					<TransactionsTableServer
						mercadoPagoId={mercadoPagoId}
						accountKey={key}
						page={page}
						searchTerm={searchTerm}
						initialTransactions={accountData.transactions.documents}
						initialPaginationInfo={accountData.transactions.pagination}
					// lastTransactionId={lastTransactionId}
					/>
				</Suspense>
			</Funds>
		)
	} catch (error) {
		console.error('Error in FundsPage:', error)
		return <FundsErrorDisplay error={error as Error} />
	}
}

// 