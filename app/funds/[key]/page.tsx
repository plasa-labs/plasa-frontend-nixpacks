import { Suspense } from 'react'
import { fetchAccountData } from '@/lib/api/funds'
import Funds from '@/components/funds/Funds'
import FundsTransactionTableServer from '@/components/funds/FundsTransactionTableServer'
import FundsTransactionsSkeletonLoader from '@/components/funds/FundsTransactionsSkeletonLoader'
import FundsErrorDisplay from '@/components/funds/FundsErrorDisplay'

export default async function FundsPage({
	params,
	searchParams
}: {
	params: { key: string }
	searchParams: { page?: string; lastTransactionId?: string; search?: string }
}) {
	const { key } = params
	const page = searchParams.page ? parseInt(searchParams.page, 10) : 1
	const lastTransactionId = searchParams.lastTransactionId
	const searchTerm = searchParams.search

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
					<FundsTransactionTableServer
						mercadoPagoId={mercadoPagoId}
						accountKey={key}
						page={page}
						// lastTransactionId={lastTransactionId}
						searchTerm={searchTerm}
						initialTransactions={accountData.transactions.documents}
						initialPaginationInfo={accountData.transactions.pagination}
					/>
				</Suspense>
			</Funds>
		)
	} catch (error) {
		console.error('Error in FundsPage:', error)
		return <FundsErrorDisplay error={error as Error} />
	}
}

