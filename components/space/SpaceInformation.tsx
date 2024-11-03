import { Calendar, ReceiptText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddressLink } from '@/components/common/AddressLink'
import { formatDate } from '@/lib/utils/formatters'
import { useSpace } from '@/contexts/SpaceContext'

export function SpaceInformation() {
	const { space } = useSpace()
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
					<span className="text-sm">Fecha de creación: {formatDate(Number(creationTimestamp))}</span>
				</div>
			</CardContent>
		</Card>
	)
}
