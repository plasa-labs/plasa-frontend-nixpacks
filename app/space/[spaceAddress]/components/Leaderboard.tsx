import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LeaderboardProps {
	members: { name: string; points: number }[]
}

export function Leaderboard({ members }: LeaderboardProps) {
	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle className="flex items-center">
					<Users className="mr-2" />
					Top Miembros (Mock)
				</CardTitle>
			</CardHeader>
			<CardContent>
				{members.map((member, index) => (
					<div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
						<span>{member.name}</span>
						<Badge variant="secondary">{member.points} puntos</Badge>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
