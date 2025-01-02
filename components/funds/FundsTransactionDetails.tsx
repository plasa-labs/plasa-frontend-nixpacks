import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Check, Clock, X, Calendar, CreditCard, Info, ArrowUpRight, DollarSign, Tag, FileText } from 'lucide-react'
import { Transaction } from '@/lib/types'
import { formatCurrency, formatDate, translateStatus, translatePaymentType, translateChargeName, translateOperationType, isIncomingTransaction, getTransactionType } from '@/lib/utils/funds'

interface TransactionDetailsProps {
	tx: Transaction
	mercadoPagoId: string
}

export default function TransactionDetails({ tx, mercadoPagoId }: TransactionDetailsProps) {
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

	const isIncoming = isIncomingTransaction(tx, mercadoPagoId)
	const transactionType = getTransactionType(tx, mercadoPagoId)

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-6">
					<div>
						<h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center mb-4">
							<Info className="h-5 w-5 mr-2 text-blue-500" />
							Resumen de la transacción
						</h4>
						<div className="bg-white dark:bg-gray-700 p-4 rounded-lg space-y-3">
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
								<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center mb-1 sm:mb-0">
									<ArrowUpRight className="h-4 w-4 mr-2 text-gray-400" />
									Tipo:
								</span>
								<span className="font-medium">{transactionType.startsWith('INCOMING') ? 'Ingreso' : 'Egreso'}</span>
							</div>
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
								<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center mb-1 sm:mb-0">
									<Tag className="h-4 w-4 mr-2 text-gray-400" />
									Estado:
								</span>
								<Badge
									variant="outline"
									className={`${getStatusColor(tx.status)} flex items-center w-fit`}
								>
									{getStatusIcon(tx.status)}
									<span className="ml-1">{translateStatus(tx.status)}</span>
								</Badge>
							</div>
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
								<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center mb-1 sm:mb-0">
									<Calendar className="h-4 w-4 mr-2 text-gray-400" />
									Fecha:
								</span>
								<span className="font-medium">{formatDate(tx.date_created)}</span>
							</div>
							{tx.money_release_date && (
								<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
									<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center mb-1 sm:mb-0">
										<Clock className="h-4 w-4 mr-2 text-gray-400" />
										Fecha de liberación:
									</span>
									<span className="font-medium">{formatDate(tx.money_release_date)}</span>
								</div>
							)}
						</div>
					</div>
					<div>
						<h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center mb-4">
							<DollarSign className="h-5 w-5 mr-2 text-green-500" />
							Detalles financieros
						</h4>
						<div className="bg-white dark:bg-gray-700 p-4 rounded-lg space-y-3">
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
								<span className="text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-0">Monto bruto:</span>
								<span className="font-semibold">{formatCurrency(tx.transaction_details.total_paid_amount, tx.currency_id)}</span>
							</div>
							<div className="space-y-2">
								<span className="text-sm text-gray-600 dark:text-gray-400">Cargos y comisiones:</span>
								{tx.charges_details.length > 0 ? (
									tx.charges_details.map((charge, index) => (
										<div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center pl-4">
											<span className="text-xs text-gray-500 dark:text-gray-400 mb-1 sm:mb-0">{translateChargeName(charge.name)}:</span>
											<span className="text-sm font-medium text-red-600 dark:text-red-400">
												-{formatCurrency(charge.amounts.original, tx.currency_id)}
											</span>
										</div>
									))
								) : (
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pl-4">
										<span className="text-xs text-gray-500 dark:text-gray-400 mb-1 sm:mb-0">Sin cargos:</span>
										<span className="text-sm font-medium text-gray-500 dark:text-gray-400">
											{formatCurrency(0, tx.currency_id)}
										</span>
									</div>
								)}
							</div>
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 border-t border-gray-200 dark:border-gray-600">
								<span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 sm:mb-0">Monto neto recibido:</span>
								<span className="font-bold text-green-600 dark:text-green-400">
									{formatCurrency(tx.transaction_details.net_received_amount, tx.currency_id)}
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="space-y-6">
					<div>
						<h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center mb-4">
							<FileText className="h-5 w-5 mr-2 text-purple-500" />
							Detalles de la operación
						</h4>
						<div className="bg-white dark:bg-gray-700 p-4 rounded-lg space-y-3">
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
								<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center mb-1 sm:mb-0">
									<DollarSign className="h-4 w-4 mr-2 text-gray-400" />
									Moneda:
								</span>
								<span className="font-medium">{tx.currency_id}</span>
							</div>
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
								<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center mb-1 sm:mb-0">
									<Tag className="h-4 w-4 mr-2 text-gray-400" />
									Tipo de operación:
								</span>
								<span className="font-medium">
									{tx.operation_type === 'yield' ? 'Rendimiento' : translateOperationType(tx.operation_type, isIncoming)}
								</span>
							</div>
							{tx.payment_type_id && (
								<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
									<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center mb-1 sm:mb-0">
										<CreditCard className="h-4 w-4 mr-2 text-gray-400" />
										Método de pago:
									</span>
									<span className="font-medium">{translatePaymentType(tx.payment_type_id)}</span>
								</div>
							)}

							{tx.description && (
								<div className="flex flex-col">
									<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center mb-1">
										<FileText className="h-4 w-4 mr-2 text-gray-400" />
										Descripción:
									</span>
									<span className="font-medium text-sm">{tx.description}</span>
								</div>
							)}
						</div>
					</div>
					{tx.status === 'rejected' && (
						<div>
							<h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center mb-4">
								<X className="h-5 w-5 mr-2 text-red-500" />
								Detalles del rechazo
							</h4>
							<div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg space-y-3">
								<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
									<span className="text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-0">Razón:</span>
									<span className="font-medium">{translateStatus(tx.status_detail)}</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

