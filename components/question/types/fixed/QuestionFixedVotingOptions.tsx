import { CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TransactionButton from "@/components/common/TransactionButton"
import { contractsVote } from '@/lib/onchain/contracts'
import { useQuestion } from "@/contexts/QuestionContext"

/**
 * QuestionVotingOptions Component
 * 
 * Renders a list of voting options for a question, allowing users to vote if they meet
 * the required conditions (can vote, question is active, and have points at deadline).
 * Each option displays its title, description, and a voting button if applicable.
 * Also shows a badge indicating if the user has already voted for that option.
 */
export default function QuestionVotingOptions() {
	const { question, refetch } = useQuestion()
	if (!question) return null

	const { options } = question
	const canVote = question.user.canVote
	const active = question.data.isActive
	const questionAddress = question.data.contractAddress
	const userPointsAtDeadline = question.user.pointsAtDeadline

	return (
		<div className="space-y-4 mb-6">
			{options.slice(1).map((option, index) => (
				<Card key={index + 1} className={option.user.voted ? "border-primary" : ""}>
					<CardContent className="pt-6">
						<div className="flex justify-between items-start mb-4">
							<div>
								<h3 className="text-base font-semibold mb-2">{option.data.title}</h3>
								<p className="text-sm text-muted-foreground">{option.data.description}</p>
							</div>
							{option.user.voted && (
								<Badge variant="secondary" className="ml-2 flex items-center whitespace-nowrap">
									<CheckCircle2 className="mr-1 h-4 w-4" />
									Tu voto
								</Badge>
							)}
						</div>
						{canVote && active && userPointsAtDeadline > BigInt(0) && (
							<div className="relative">
								<TransactionButton
									className="w-full"
									transactionData={contractsVote(
										questionAddress as `0x${string}`,
										index + 1
									)}
									onSuccess={() => refetch()}>
									Votar por esta opción
								</TransactionButton>
							</div>
						)}
					</CardContent>
				</Card>
			))}
		</div>
	)
}
