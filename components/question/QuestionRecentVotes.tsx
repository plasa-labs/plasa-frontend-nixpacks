import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { parseAbiItem } from 'viem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils/formatters'
import { AddressScanLink } from '@/components/common/ScanLink'
import { useQuestion } from '@/contexts/QuestionContext'

interface Vote {
	voter: string
	optionId: number
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
				event: parseAbiItem('event Voted(address indexed voter, uint256 indexed optionId, uint256 timestamp)'),
				fromBlock: BigInt(0),
			})

			const initialVotes = logs.map(log => ({
				voter: log.args.voter as string,
				optionId: Number(log.args.optionId),
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
								<div key={index} className="flex justify-between items-center text-sm">
									<div className="flex flex-col">
										<AddressScanLink address={vote.voter} />
										<span className="text-xs text-muted-foreground">
											Opción {vote.optionId}
										</span>
									</div>
									<span className="text-xs text-muted-foreground">
										{formatDate(BigInt(vote.timestamp))}
									</span>
								</div>
							))
						)}
					</div>
				</CardContent>
			</Card>
		</>
	)
} 