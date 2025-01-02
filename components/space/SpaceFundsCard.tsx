import Link from 'next/link'
import { Wallet, Search } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/funds'
import { AccountInfo } from '@/lib/types'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface AccountItemProps {
	account: AccountInfo
}

export default function AccountItem({ account }: AccountItemProps) {
	const balance = account.balance_available + account.balance_unreleased

	return (
		<Link
			href={`/funds/${account.external_key}`}
		// className="block transition-transform duration-200 ease-in-out hover:scale-100"
		>
			<Card className="overflow-hidden mb-4 cursor-pointer hover:shadow-md transition-shadow">
				<CardContent className="p-4 sm:p-6">
					<div className="flex flex-col space-y-4">
						<div className="flex-grow min-w-0">
							<h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
								{account.name}
							</h3>
						</div>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div className="flex items-center gap-2">
								<Wallet className="h-5 w-5 text-blue-500 dark:text-blue-400" />
								<span className="text-sm font-medium text-gray-500 dark:text-gray-400">
									Saldo:
								</span>
								<span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
									{formatCurrency(balance, 'ARS')}
								</span>
							</div>
							<Button
								variant="outline"
								size="sm"
								className="w-full sm:w-auto bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
							// onClick={(e) => {
							// 	e.preventDefault()
							// 	// Additional action for the button if needed
							// }}
							>
								<Search className="w-4 h-4 mr-2" />
								Ver detalles
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}

