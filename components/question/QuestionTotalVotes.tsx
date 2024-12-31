import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuestion } from "@/contexts/QuestionContext"

export default function QuestionTotalVotes() {
	const { question } = useQuestion()
	if (!question) return null

	const voteCount = question.data.voteCount

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base font-semibold">Total de votos</CardTitle>
			</CardHeader>
			<CardContent className="pt-6">
				<p className="text-3xl font-bold">{voteCount.toString()}</p>
			</CardContent>
		</Card>
	)
}