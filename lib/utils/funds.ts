import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Transaction } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number, currency: string) => {
	return new Intl.NumberFormat('es-AR', { style: 'currency', currency: currency }).format(amount)
}

export const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
}

export const translateStatus = (status: string) => {
	const statusMap: { [key: string]: string } = {
		'approved': 'Aprobado',
		'pending': 'Pendiente',
		'rejected': 'Rechazado',
		'refunded': 'Reembolsado',
		'cancelled': 'Cancelado',
		'in_process': 'En proceso',
		'in_mediation': 'En mediación',
		'charged_back': 'Contracargo',
		'released': 'Liberado',
		'accredited': 'Pago acreditado',
		'partially_refunded': 'Reembolso parcial',
		'pending_capture': 'Pendiente de captura',
		'offline_process': 'Procesando offline',
		'pending_contingency': 'Procesando pago',
		'pending_review_manual': 'En revisión manual',
		'pending_waiting_transfer': 'Esperando transferencia',
		'pending_waiting_payment': 'Esperando pago',
		'pending_challenge': 'Confirmación pendiente',
		'expired': 'Expirado',
		'by_collector': 'Cancelado por vendedor',
		'by_payer': 'Cancelado por comprador',
		'settled': 'Retenido por contracargo',
		'reimbursed': 'Devuelto por contracargo',
		'by_admin': 'Devuelto por administrador',
		'bank_error': 'Error bancario',
		'cc_rejected_3ds_challenge': 'No superó 3DS',
		'cc_rejected_3ds_mandatory': 'Falta 3DS obligatorio',
		'cc_rejected_bad_filled_card_number': 'Número de tarjeta incorrecto',
		'cc_rejected_bad_filled_date': 'Fecha de vencimiento incorrecta',
		'cc_rejected_bad_filled_other': 'Datos incorrectos',
		'cc_rejected_bad_filled_security_code': 'Código de seguridad incorrecto',
		'cc_rejected_blacklist': 'Tarjeta rechazada',
		'cc_rejected_call_for_authorize': 'Llamar para autorizar',
		'cc_rejected_card_disabled': 'Tarjeta desactivada',
		'cc_rejected_card_error': 'Error en tarjeta',
		'cc_rejected_duplicated_payment': 'Pago duplicado',
		'cc_rejected_high_risk': 'Pago de alto riesgo',
		'cc_rejected_insufficient_amount': 'Fondos insuficientes',
		'cc_rejected_invalid_installments': 'Cuotas no válidas',
		'cc_rejected_max_attempts': 'Límite de intentos alcanzado',
		'cc_rejected_other_reason': 'Pago no procesado',
		'cc_amount_rate_limit_exceeded': 'Límite de monto excedido',
		'rejected_insufficient_data': 'Datos insuficientes',
		'rejected_by_bank': 'Rechazado por banco',
		'rejected_by_regulations': 'Rechazado por regulaciones',
		'insufficient_amount': 'Monto insuficiente',
	}
	return statusMap[status] || status
}

export const translatePaymentType = (type: string) => {
	const typeMap: { [key: string]: string } = {
		'account_money': 'Dinero en cuenta',
		'credit_card': 'Tarjeta de crédito',
		'debit_card': 'Tarjeta de débito',
		'bank_transfer': 'Transferencia bancaria',
		'ticket': 'Boleto',
		'atm': 'Cajero automático'
	}
	return typeMap[type] || type
}

export const translateChargeName = (chargeName: string) => {
	const chargeNameMap: { [key: string]: string } = {
		'tax_withholding_collector-debitos_creditos': 'Impuesto sobre los Créditos y Débitos',
		'mercadopago_fee': 'Comisión de Mercado Pago',
		'third_payment': 'Pago a terceros',
	}
	return chargeNameMap[chargeName] || chargeName
}

export const translateOperationType = (type: string, isIncoming: boolean) => {
	const typeMap: { [key: string]: string } = {
		'regular_payment': isIncoming ? 'Cobro regular' : 'Pago regular',
		'money_transfer': 'Transferencia de dinero',
		'recurring_payment': isIncoming ? 'Cobro recurrente' : 'Pago recurrente',
		'account_fund': 'Fondeo de cuenta'
	}
	return typeMap[type] || type
}

export const isIncomingTransaction = (tx: Transaction, mercadoPagoId: string) => {
	return tx.collector_id == mercadoPagoId
}

export const getTransactionType = (tx: Transaction, mercadoPagoId: string) => {
	const isIncoming = isIncomingTransaction(tx, mercadoPagoId)
	const isRejected = tx.status === 'rejected'
	if (isIncoming && isRejected) return 'INCOMING_REJECTED'
	if (isIncoming && !isRejected) return 'INCOMING'
	if (!isIncoming && isRejected) return 'OUTGOING_REJECTED'
	return 'OUTGOING'
};

