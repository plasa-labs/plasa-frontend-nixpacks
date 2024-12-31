export const abbreviateAddress = (address: string): string => {
	return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const scanLink = (address: string): string => `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL}/address/${address}`

export const formatDate = (timestamp: string | bigint): string => {
	const formatter = new Intl.DateTimeFormat('es-AR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	})

	try {
		// Handle both string dates and bigint timestamps
		const date = typeof timestamp === 'bigint'
			? new Date(Number(timestamp) * 1000)
			: new Date(timestamp)

		// Check if date is valid
		if (isNaN(date.getTime())) {
			return 'Fecha inválida'
		}

		return formatter.format(date)
	} catch (error) {
		console.error('Error formatting date:', error)
		return 'Fecha inválida'
	}
}

export const formatPoints = (points: bigint): string => {
	const formatter = new Intl.NumberFormat('es-AR', {
		maximumFractionDigits: 0,
		minimumFractionDigits: 0,
	})

	return formatter.format(Math.floor(Number(points) / 1e18))
}