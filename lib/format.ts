// Utility function to format points
export const formatPoints = (points: number | bigint | string): string => {
	return Math.floor(Number(points) / 1e17).toLocaleString('es-AR', {
		maximumFractionDigits: 0,
		minimumFractionDigits: 0,
	})
}