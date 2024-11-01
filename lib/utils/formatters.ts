export const abbreviateAddress = (address: string) => {
	return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const scanLink = (address: string) => `https://sepolia.basescan.org/address/${address}`

export const formatDate = (timestamp: number) => {
	return new Date(Number(timestamp) * 1000).toLocaleString('es-AR', {
		timeZone: 'America/Argentina/Buenos_Aires',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	})
}

export const formatPoints = (points: number | bigint | string): string => {
	return Math.floor(Number(points) / 1e17).toLocaleString('es-AR', {
		maximumFractionDigits: 0,
		minimumFractionDigits: 0,
	})
}