import { Suspense } from 'react'
import AccountItem from '@/components/space/SpaceFundsCard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SkeletonLoader from '@/components/space/loading/SpaceFundsListSkeleton'
// import ErrorDisplay from '@/components/ErrorDisplay'
import { AccountInfo } from '@/lib/types'

interface SpaceFundsListProps {
	accounts: AccountInfo[]
}

export default function SpaceFundsList({ accounts }: SpaceFundsListProps) {
	return (
		<Card>
			<CardHeader>
				{/* <CardHeader className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6"> */}
				{/* <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Fondos</CardTitle> */}
				<CardTitle>Fondos</CardTitle>
			</CardHeader>
			<CardContent>
				<Suspense fallback={<SkeletonLoader />}>
					<div className="space-y-4">
						{accounts && accounts.length > 0 ? (
							accounts.map((account: AccountInfo) => (
								<AccountItem key={account.id} account={account} />
							))
						) : (
							<p className="py-4 sm:py-6 text-center text-gray-500 dark:text-gray-400">No hay cuentas disponibles.</p>
						)}
					</div>
				</Suspense>
			</CardContent>
		</Card>
	)
}