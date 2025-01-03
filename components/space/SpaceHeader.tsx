import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPoints } from '@/lib/utils/formatters'
import { useSpace } from '@/contexts/SpaceContext'

/**
 * SpaceHeader Component
 * 
 * Displays the header section of a space, including:
 * - Space logo/image
 * - Space name and description
 * - Current point balance with symbol
 * 
 * The component relies on the SpaceContext to access space data
 * and automatically handles the case when space data is not available.
 */
export default function SpaceHeader() {
	const { space } = useSpace()

	if (!space) return null

	const { name, description, imageUrl } = space.data
	const { symbol } = space.points.data
	const points = space.points.user.currentBalance

	return (
		<Card className="mb-6">
			<CardHeader>
				<div className="flex items-start">
					<div className="mr-4 flex-shrink-0">
						<Image src={imageUrl} alt={`${name} logo`} width={64} height={64} className="rounded-full" />
					</div>
					<div className="flex-grow">
						<CardTitle className="text-3xl mb-2">{name}</CardTitle>
						<CardDescription>{description}</CardDescription>
					</div>
					<Badge variant="secondary" className="text-lg px-3 py-1 ml-4 whitespace-nowrap">
						{formatPoints(points)} {symbol}
					</Badge>
				</div>
			</CardHeader>
		</Card>
	)
}
