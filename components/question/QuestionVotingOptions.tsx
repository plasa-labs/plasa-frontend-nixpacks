import { CheckCircle2 } from "lucide-react"
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusAction, TransactionStatusLabel } from '@coinbase/onchainkit/transaction'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OptionView } from '@/lib/onchain/types/options'
import { contractsVote } from '@/lib/onchain/contracts'

interface QuestionVotingOptionsProps {
	options: OptionView[]
	onVote: (index: number) => void
	canVote: boolean
	active: boolean
	questionAddress: string
	isConnected: boolean
	userPointsAtDeadline: number
}

export const QuestionVotingOptions = ({
	options,
	onVote,
	canVote,
	active,
	questionAddress,
	isConnected,
	userPointsAtDeadline
}: QuestionVotingOptionsProps) => {
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
						{canVote && active && isConnected && userPointsAtDeadline > 0 && (
							<Transaction
								chainId={84532}
								contracts={contractsVote(questionAddress as `0x${string}`, index + 1)}
								onSuccess={(response) => {
									console.log('Vote transaction successful:', response)
									onVote(index + 1)
								}}
								onError={(error) => {
									console.error('Vote transaction failed:', error)
								}}
							>
								<TransactionButton text="Votar por esta opción" />
								<TransactionStatus>
									<TransactionStatusLabel />
									<TransactionStatusAction />
								</TransactionStatus>
							</Transaction>
						)}
					</CardContent>
				</Card>
			))}
		</div>
	)
}
