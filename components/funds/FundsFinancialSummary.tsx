import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight, Wallet, Lock, Unlock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/funds'
import { AccountData } from '@/lib/types'

interface FundsFinancialSummaryProps {
	accountData: AccountData
}

export default function FundsFinancialSummary({ accountData }: FundsFinancialSummaryProps) {
	const cards = [
		{
			title: "Saldo actual",
			icon: Wallet,
			value: accountData.account.balance_available + accountData.account.balance_unreleased,
			color: "bg-blue-50 dark:bg-blue-900",
			textColor: "text-blue-600 dark:text-blue-400",
			subValues: [
				{
					title: "Disponible",
					icon: Unlock,
					value: accountData.account.balance_available,
				},
				{
					title: "A liberar",
					icon: Lock,
					value: accountData.account.balance_unreleased,
				},
			],
		},
		{
			title: "Ingresos totales",
			icon: ArrowUpRight,
			value: accountData.account.balance_available + accountData.account.balance_unreleased + accountData.account.total_out,
			color: "bg-green-50 dark:bg-green-900",
			textColor: "text-green-600 dark:text-green-400"
		},
		{
			title: "Egresos totales",
			icon: ArrowDownRight,
			value: accountData.account.total_out,
			color: "bg-red-50 dark:bg-red-900",
			textColor: "text-red-600 dark:text-red-400"
		}
	]

	return (
		<Card className="col-span-1 md:col-span-2 lg:col-span-4">
			<CardContent className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{cards.map((card, index) => (
						<div key={index} className={`flex flex-col ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
							<div className={`flex flex-col h-full ${card.color} rounded-lg p-6 space-y-4`}>
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</span>
									<card.icon className={`h-6 w-6 ${card.textColor}`} />
								</div>
								<div className={`text-2xl font-bold ${card.textColor}`}>
									{formatCurrency(card.value, 'ARS')}
								</div>
								{card.subValues && (
									<div className="mt-4 space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
										{card.subValues.map((subValue, subIndex) => (
											<div key={subIndex} className="flex justify-between items-center">
												<div className="flex items-center">
													<subValue.icon className={`h-4 w-4 mr-2 ${card.textColor}`} />
													<span className="text-sm text-gray-500 dark:text-gray-400">{subValue.title}</span>
												</div>
												<span className={`text-sm font-semibold ${card.textColor}`}>
													{formatCurrency(subValue.value, 'ARS')}
												</span>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}