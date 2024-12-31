import { fetchTransactions, searchTransactionsByPrefix } from '@/lib/api/funds'
import FundsTransactionsTable from '@/components/funds/FundsTransactionsTable'
import FundsTransactionsClientPagination from '@/components/funds/FundsTransactionsClientPagination'
import FundsTransactionsSearchResultsWarning from '@/components/funds/FundsTransactionsSearchResultsWarning'
import { Transaction } from '@/lib/types'

interface TransactionsTableServerProps {
	mercadoPagoId: string
	accountKey: string
	page: number
	// lastTransactionId?: string
	searchTerm?: string
	initialTransactions: Transaction[]
	initialPaginationInfo: { lastDocId: string; hasMore: boolean }
}

export default async function TransactionsTableServer({
	mercadoPagoId,
	accountKey,
	page,
	// lastTransactionId,
	searchTerm,
	initialTransactions,
	initialPaginationInfo
}: TransactionsTableServerProps) {
	let transactionsData = {
		documents: [] as Transaction[],
		pagination: { lastDocId: '', hasMore: false }
	}
	let searchHasMore = false
	const pageHistory: { page: number; lastTransactionId: string }[] = [
		{ page: 1, lastTransactionId: initialPaginationInfo.lastDocId }
	]

	if (searchTerm) {
		const searchResults = await searchTransactionsByPrefix(mercadoPagoId, searchTerm)
		transactionsData = {
			documents: searchResults.transactions,
			pagination: { lastDocId: '', hasMore: false }
		}
		searchHasMore = searchResults.hasMore
	} else if (page === 1) {
		transactionsData = {
			documents: initialTransactions,
			pagination: initialPaginationInfo
		}
	} else {
		for (let i = 2; i <= page; i++) {
			const lastId = i === 2 ? initialPaginationInfo.lastDocId : pageHistory[i - 2]?.lastTransactionId || ''
			const pageData = await fetchTransactions(mercadoPagoId, lastId)

			transactionsData = pageData

			pageHistory.push({ page: i, lastTransactionId: pageData.pagination.lastDocId })
		}
	}

	return (
		<>
			{searchTerm && searchHasMore && (
				<FundsTransactionsSearchResultsWarning searchTerm={searchTerm} />
			)}
			<FundsTransactionsTable
				transactions={transactionsData.documents}
				mercadoPagoId={mercadoPagoId}
				isLoading={false}
				isSearchActive={!!searchTerm}
			/>
			{!searchTerm && (
				<FundsTransactionsClientPagination
					paginationInfo={transactionsData.pagination}
					currentPage={page}
					accountKey={accountKey}
					pageHistory={pageHistory}
				/>
			)}
		</>
	)
}

