export const abbreviateAddress = (address: string) => {
	return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const scanLink = (address: string) => `https://sepolia.basescan.org/address/${address}`

export const formatDate = (timestamp: bigint) => {
	// Create a fixed date formatter to ensure consistency
	const formatter = new Intl.DateTimeFormat('es-AR', {
		// timeZone: 'America/Argentina/Buenos_Aires',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	})

	return formatter.format(new Date(Number(timestamp) * 1000))
}

export const formatPoints = (points: bigint): string => {
	const formatter = new Intl.NumberFormat('es-AR', {
		maximumFractionDigits: 0,
		minimumFractionDigits: 0,
	})

	return formatter.format(Math.floor(Number(points) / 1e18))
}