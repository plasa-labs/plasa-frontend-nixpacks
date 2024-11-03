import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSpace } from "@/contexts/SpaceContext"

interface SpaceLeaderboardProps { }

const mockLeaderboard = [
	{ name: "alice", points: 8900 },
	{ name: "bob", points: 7500 },
	{ name: "charlie", points: 6200 },
	{ name: "david", points: 5800 },
	{ name: "eva", points: 4900 },
]

export function SpaceLeaderboard() {
	const { space } = useSpace()
	const { top10Holders } = space.points.points.data
	console.log(top10Holders)

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle className="flex items-center">
					<Users className="mr-2" />
					Top Miembros (Mock)
				</CardTitle>
			</CardHeader>
			<CardContent>
				{mockLeaderboard.map((member, index) => (
					<div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
						<span>{member.name}</span>
						<Badge variant="secondary">{member.points} puntos</Badge>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
