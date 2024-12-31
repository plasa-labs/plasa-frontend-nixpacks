import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FundsOrganizationCard from './FundsOrganizationCard'
import FundsFinancialSummary from './FundsFinancialSummary'
import FundsTransactionsClientSearch from './FundsTransactionsClientSearch'
import { AccountData } from '@/lib/types'

interface FundsProps {
	accountData: AccountData
	accountKey: string
	searchTerm?: string
	children: React.ReactNode
}

export default function Funds({
	accountData,
	accountKey,
	searchTerm,
	children
}: FundsProps) {
	return (
		<main className="container mx-auto px-4 py-8">
			<div className="grid grid-cols-1 gap-6 mb-8">
				<FundsOrganizationCard accountData={accountData} />
				<FundsFinancialSummary accountData={accountData} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-xl md:text-2xl text-gray-800 dark:text-gray-200">Movimientos</CardTitle>
				</CardHeader>
				<CardContent>
					<FundsTransactionsClientSearch
						initialSearchTerm={searchTerm || ''}
						accountKey={accountKey}
					/>
					{children}
				</CardContent>
			</Card>
		</main>
	)
}

