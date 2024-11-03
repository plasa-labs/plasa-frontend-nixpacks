import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { OptionView } from '@/lib/onchain/types/interfaces'

interface QuestionVotingProgressProps {
	options: OptionView[]
}

export const QuestionVotingProgress = ({ options }: QuestionVotingProgressProps) => {
	const totalPoints = options.slice(1).reduce((sum, option) => sum + Number(option.data.pointsAtDeadline), 0)

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Progreso de la Votación</CardTitle>
			</CardHeader>
			<CardContent>
				{options.slice(1).map((option, index) => {
					const percentage = totalPoints === 0 ? 0 : (Number(option.data.pointsAtDeadline) / totalPoints) * 100
					return (
						<div key={index + 1} className="mb-4 last:mb-0">
							<div className="flex justify-between mb-1">
								<span className="text-sm font-medium">{option.data.title}</span>
								<span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
							</div>
							<div className="relative pt-1">
								<div className="flex mb-2 items-center justify-between">
									<div>
										<span className="text-lg font-semibold inline-block text-primary">
											{Math.floor(Number(option.data.pointsAtDeadline) / 1e15).toLocaleString()} puntos
										</span>
									</div>
									<div className="text-right">
										<span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary text-primary-foreground">
											{option.data.voteCount.toString()} votos
										</span>
									</div>
								</div>
								<Progress value={percentage} className="h-2" />
							</div>
						</div>
					)
				})}
			</CardContent>
		</Card>
	)
}
