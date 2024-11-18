import { Card, CardContent } from "@/components/ui/card"
import { useQuestion } from "@/contexts/QuestionContext"

export default function QuestionTotalVotes() {
	const { question } = useQuestion()
	if (!question) return null

	const voteCount = question.data.voteCount

	return (
		<Card>
			<CardContent className="pt-6">
				<h2 className="text-base font-semibold mb-2">Total de Votos</h2>
				<p className="text-3xl font-bold">{voteCount.toString()}</p>
			</CardContent>
		</Card>
	)
}