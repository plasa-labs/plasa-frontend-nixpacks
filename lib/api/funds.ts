import { AccountData, Transaction } from '@/lib/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchAccountData = async (key: string): Promise<AccountData> => {
	const url = `${API_BASE_URL}mercadopago/account/${key}`
	console.log(`Fetching account data from: ${url}`)

	try {
		const response = await fetch(url, { next: { revalidate: 60 } })
		console.log(`Response status: ${response.status}`)

		if (!response.ok) {
			const errorBody = await response.text()
			console.error(`Error response body: ${errorBody}`)
			throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`)
		}

		const data = await response.json()
		console.log('Successfully fetched account data')
		return data
	} catch (error) {
		console.error('Error fetching account data:', error)
		if (error instanceof Error) {
			throw new Error(`Failed to fetch account data: ${error.message}`)
		} else {
			throw new Error('Failed to fetch account data: Unknown error')
		}
	}
}

export const fetchTransactions = async (mercadoPagoId: string, lastDocId?: string): Promise<{ documents: Transaction[], pagination: { lastDocId: string, hasMore: boolean } }> => {
	const url = `${API_BASE_URL}mercadopago/transactions/${mercadoPagoId}${lastDocId ? `?lastTransactionId=${lastDocId}` : ''}`
	console.log(`Fetching transactions from: ${url}`)

	try {
		const response = await fetch(url, { next: { revalidate: 30 } }) // Cache for 30 seconds
		console.log(`Response status: ${response.status}`)

		if (!response.ok) {
			const errorBody = await response.text()
			console.error(`Error response body: ${errorBody}`)
			throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`)
		}

		const data = await response.json()
		console.log('Successfully fetched transactions')
		return data
	} catch (error) {
		console.error('Error fetching transactions:', error)
		if (error instanceof Error) {
			throw new Error(`Failed to fetch transactions: ${error.message}`)
		} else {
			throw new Error('Failed to fetch transactions: Unknown error')
		}
	}
}

export const searchTransactionsByPrefix = async (mercadoPagoId: string, prefix: string): Promise<{ transactions: Transaction[], hasMore: boolean }> => {
	const url = `${API_BASE_URL}mercadopago/transactions/${mercadoPagoId}/${prefix}`
	console.log(`Searching transactions from: ${url}`)

	try {
		const response = await fetch(url, { next: { revalidate: 30 } }) // Cache for 30 seconds
		console.log(`Response status: ${response.status}`)

		if (!response.ok) {
			const errorBody = await response.text()
			console.error(`Error response body: ${errorBody}`)
			throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`)
		}

		const data = await response.json()
		console.log('Successfully searched transactions')
		return data
	} catch (error) {
		console.error('Error searching transactions:', error)
		if (error instanceof Error) {
			throw new Error(`Failed to search transactions: ${error.message}`)
		} else {
			throw new Error('Failed to search transactions: Unknown error')
		}
	}
};

