import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { parseAbiItem } from 'viem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils/formatters'
import { useQuestion } from '@/contexts/QuestionContext'
import { formatPoints } from '@/lib/utils/formatters'
import { Badge } from '@/components/ui/badge'

interface Vote {
	voter: string
	name: string
	optionId: number
	points: number
	timestamp: number
}


export default function QuestionRecentVotes() {
	const [recentVotes, setRecentVotes] = useState<Vote[]>([])

	const { question } = useQuestion()
	const publicClient = usePublicClient()

	const questionAddress = question?.data.contractAddress as `0x${string}`

	useEffect(() => {
		if (!questionAddress) return

		const fetchInitialVotes = async () => {
			const logs = await publicClient.getLogs({
				address: questionAddress,
				event: parseAbiItem('event Voted(address voter, string name, uint256 indexed optionId, uint256 points, uint256 timestamp)'),
				fromBlock: BigInt(0),
			})

			const initialVotes = logs.map(log => ({
				voter: log.args.voter as string,
				name: log.args.name as string,
				optionId: Number(log.args.optionId),
				points: Number(log.args.points),
				timestamp: Number(log.args.timestamp)
			})).slice(0, 10)

			setRecentVotes(initialVotes)
		}

		fetchInitialVotes().catch(console.error)
	}, [questionAddress, publicClient])

	if (!questionAddress) return null

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Últimos votos</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{recentVotes.length === 0 ? (
							<p className="text-sm text-muted-foreground">No hay votos recientes</p>
						) : (
							recentVotes.map((vote, index) => (
								<div key={index} className="flex flex-wrap items-center gap-4 py-2 justify-between">
									<div className="flex flex-col sm:flex-row sm:items-center">
										<span className="font-medium">{vote.name}</span>
										<span className="text-sm text-muted-foreground sm:ml-2">
											{question?.options[vote.optionId]?.data.title || `Opción ${vote.optionId}`}
										</span>
									</div>
									<div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-4 ml-auto">
										<Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
											{formatPoints(BigInt(vote.points))} pts
										</Badge>
										<span className="text-sm text-muted-foreground">
											{formatDate(BigInt(vote.timestamp))}
										</span>
									</div>
								</div>
							))
						)}
					</div>
				</CardContent>
			</Card >
		</>
	)
} 