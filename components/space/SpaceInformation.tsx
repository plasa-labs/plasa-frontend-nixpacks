// External imports
// import { Calendar, ReceiptText } from 'lucide-react'

// Internal UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddressScanLink } from '@/components/common/ScanLink'

// Utils and hooks
import { formatDate } from '@/lib/utils/formatters'
import { useSpace } from '@/contexts/SpaceContext'

/**
 * SpaceInformation component displays basic information about a space,
 * including its contract address and creation date.
 * 
 * Uses the SpaceContext to access space data.
 * Returns null if no space data is available.
 */
export default function SpaceInformation() {
	const { space } = useSpace()
	if (!space) return null

	const { contractAddress, creationTimestamp } = space.data

	return (
		<Card>
			<CardHeader>
				<CardTitle>Información del Espacio</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="flex items-center gap-2">
					{/* <Calendar className="mr-2 h-4 w-4" /> */}
					<span className="text-sm">Fecha de creación:</span>
					<span className="text-sm">{formatDate(creationTimestamp)}</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm">Contrato del espacio: </span>
					<AddressScanLink address={contractAddress} className="text-sm" />
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm">Contrato de los puntos: </span>
					<AddressScanLink address={space.points.points.data.contractAddress} className="text-sm" />
				</div>
			</CardContent>
		</Card>
	)
}
