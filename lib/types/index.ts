export interface AccountData {
	account: {
		owner: string
		cuit: string
		cvu: string
		id: string
		name: string
		balance_available: number
		balance_unreleased: number
		total_out: number
	}
	transactions: {
		documents: Transaction[]
		pagination: {
			lastDocId: string
			hasMore: boolean
		}
	}
}

export interface Transaction {
	id: number
	status: string
	status_detail: string
	currency_id: string
	transaction_amount: number
	date_created: string
	date_approved: string | null
	money_release_date: string | null
	operation_type: string
	payment_type_id: string
	collector_id: string
	charges_details: {
		name: string
		type: string
		amounts: {
			original: number
			refunded: number
		}
	}[]
	transaction_details: {
		net_received_amount: number
		total_paid_amount: number
		overpaid_amount: number
		installment_amount: number
	}
	description: string
}

export interface OrganizationData {
	name: string
	balance: {
		total: number
		available: number
		unavailable: number
	}
	totalDonations: number
	totalExpenses: number
}

