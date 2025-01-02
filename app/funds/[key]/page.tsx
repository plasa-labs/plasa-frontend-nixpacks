import { Suspense } from 'react'
import { fetchAccountData } from '@/lib/api/funds'
import Funds from '@/components/funds/Funds'
import FundsTransactionTableServer from '@/components/funds/FundsTransactionTableServer'
import FundsTransactionsSkeletonLoader from '@/components/funds/FundsTransactionsSkeletonLoader'
import FundsErrorDisplay from '@/components/funds/FundsErrorDisplay'

interface PageProps {
	params: Promise<{ key: string }>
	searchParams: Promise<{ page?: string; search?: string }>
}

export default async function FundsPage({
	params,
	searchParams
}: PageProps) {
	const { key } = await params
	const { page, search } = await searchParams
	const currentPage = page ? parseInt(page, 10) : 1

	try {
		const accountData = await fetchAccountData(key)
		const mercadoPagoId = accountData.account.id

		return (
			<Funds
				accountData={accountData}
				accountKey={key}
				searchTerm={search}
			>
				<Suspense fallback={<FundsTransactionsSkeletonLoader />}>
					<FundsTransactionTableServer
						mercadoPagoId={mercadoPagoId}
						accountKey={key}
						page={currentPage}
						// lastTransactionId={lastTransactionId}
						searchTerm={search}
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

