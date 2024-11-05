// External imports
import { Calendar, ReceiptText } from 'lucide-react'

// Internal UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AddressLink from '@/components/common/AddressLink'

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
			<CardContent>
				<div className="flex items-center mb-2">
					<ReceiptText className="mr-2 h-4 w-4" />
					<span className="text-sm">Dirección del contrato: </span>
					<AddressLink address={contractAddress} className="ml-2 text-sm" />
				</div>
				<div className="flex items-center">
					<Calendar className="mr-2 h-4 w-4" />
					<span className="text-sm">Fecha de creación: {formatDate(creationTimestamp)}</span>
				</div>
			</CardContent>
		</Card>
	)
}
