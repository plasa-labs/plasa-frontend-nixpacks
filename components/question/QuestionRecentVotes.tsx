import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { parseAbiItem } from 'viem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatPoints } from '@/lib/utils/formatters'
import { useQuestion } from '@/contexts/QuestionContext'
// import { Avatar, AvatarFallback } from '@/components/ui/avatar'

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

			const initialVotes = logs
				.map(log => ({
					voter: log.args.voter as string,
					name: log.args.name as string,
					optionId: Number(log.args.optionId),
					points: Number(log.args.points),
					timestamp: Number(log.args.timestamp)
				}))
				.sort((a, b) => b.timestamp - a.timestamp)
				.slice(0, 10)

			setRecentVotes(initialVotes)
		}

		fetchInitialVotes().catch(console.error)
	}, [questionAddress, publicClient])

	if (!questionAddress) return null

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-base font-semibold">Últimos votos</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				{recentVotes.length === 0 ? (
					<p className="text-center text-gray-500 py-4">No hay votos recientes</p>
				) : (
					<ul className="">
						{recentVotes.map((vote, index) => (
							<li key={index} className="p-4 hover:bg-gray-50 transition-colors">
								<div className="flex items-center space-x-4">
									{/* <Avatar className="w-10 h-10 bg-primary text-primary-foreground">
										<AvatarFallback>{vote.name.charAt(0).toUpperCase()}</AvatarFallback>
									</Avatar> */}
									<div className="flex-grow min-w-0">
										<p className="font-medium text-sm truncate">{vote.name}</p>
										<p className="text-xs text-gray-500 truncate">
											{question?.options[vote.optionId]?.data.title || `Option ${vote.optionId}`}
										</p>
									</div>
									<div className="text-right flex-shrink-0">
										<p className="font-semibold text-sm">{formatPoints(BigInt(vote.points))} pts</p>
										<p className="text-xs text-gray-500">{formatDate(BigInt(vote.timestamp))}</p>
									</div>
								</div>
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	)
}

