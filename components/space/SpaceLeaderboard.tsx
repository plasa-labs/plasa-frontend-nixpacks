import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSpace } from "@/contexts/SpaceContext"
import { formatPoints } from "@/lib/utils/formatters"
import { AddressLink } from "@/components/common/AddressLink"

export function SpaceLeaderboard() {
	const { space } = useSpace()
	if (!space) return null

	const { top10Holders } = space.points.points.data
	const symbol = space.points.points.data.symbol

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle className="flex items-center">
					<Users className="mr-2" />
					Top Miembros
				</CardTitle>
			</CardHeader>
			<CardContent>
				{top10Holders.length === 0 ? (
					<div className="text-center text-muted-foreground">
						Aún no hay miembros en este espacio
					</div>
				) : (
					top10Holders.map((holder, index) => (
						<div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
							<span><AddressLink address={holder.user} /></span>
							<Badge variant="secondary">{formatPoints(holder.balance)} {symbol}</Badge>
						</div>
					))
				)}
			</CardContent>
		</Card>
	)
}
