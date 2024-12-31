'use client'

import React, { useState } from 'react'
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Check, Clock, X } from 'lucide-react'
import { Transaction } from '@/lib/types'
// import { formatCurrency, formatDate, translateStatus, isIncomingTransaction, getTransactionType } from '@/lib/utils/funds'
import { formatCurrency, formatDate, translateStatus, getTransactionType } from '@/lib/utils/funds'
import FundsTransactionDetails from './FundsTransactionDetails'

interface FundsTransactionRowProps {
	tx: Transaction
	mercadoPagoId: string
}

export default function FundsTransactionRow({ tx, mercadoPagoId }: FundsTransactionRowProps) {
	const [isExpanded, setIsExpanded] = useState(false)

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'approved':
				return <Check className="h-4 w-4 text-green-500" />
			case 'pending':
			case 'in_process':
				return <Clock className="h-4 w-4 text-yellow-500" />
			default:
				return <X className="h-4 w-4 text-red-500" />
		}
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'approved':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
			case 'pending':
			case 'in_process':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
			default:
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
		}
	}

	// const isIncoming = isIncomingTransaction(tx, mercadoPagoId)
	const transactionType = getTransactionType(tx, mercadoPagoId)

	return (
		<React.Fragment>
			<TableRow className="h-16 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setIsExpanded(!isExpanded)}>
				<TableCell className="font-medium w-[80px] md:w-[120px]">{tx.id}</TableCell>
				<TableCell className="hidden sm:table-cell w-[100px] md:w-[140px]">
					<Badge
						variant="outline"
						className={`${getStatusColor(tx.status)} flex items-center w-fit`}
					>
						{getStatusIcon(tx.status)}
						<span className="ml-1">{translateStatus(tx.status)}</span>
					</Badge>
				</TableCell>
				<TableCell className={`w-[100px] md:w-[140px] font-semibold ${tx.status === 'rejected' ? 'text-gray-500 dark:text-gray-400 line-through' : transactionType.startsWith('INCOMING') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
					{transactionType.startsWith('INCOMING') ? '+' : '-'}
					{formatCurrency(tx.transaction_details.net_received_amount, tx.currency_id)}
				</TableCell>
				<TableCell className="hidden md:table-cell w-[180px]">{formatDate(tx.date_created)}</TableCell>
				<TableCell className="w-[40px] p-0">
					<div className="flex items-center justify-center h-full">
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
							<span className="sr-only">{isExpanded ? "Ocultar" : "Mostrar"} detalles</span>
						</Button>
					</div>
				</TableCell>
			</TableRow>
			{isExpanded && (
				<TableRow>
					<TableCell colSpan={5} className="p-0 border-b">
						<div className="overflow-x-auto">
							<div className="px-4 py-6 bg-gray-50 dark:bg-gray-800 min-w-[300px]">
								<FundsTransactionDetails tx={tx} mercadoPagoId={mercadoPagoId} />
							</div>
						</div>
					</TableCell>
				</TableRow>
			)}
		</React.Fragment>
	)
}