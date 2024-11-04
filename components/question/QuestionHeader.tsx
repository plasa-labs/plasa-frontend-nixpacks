import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle } from "lucide-react"
import { useQuestion } from "@/contexts/QuestionContext"

export const QuestionHeader = () => {
	const { question, timeLeft } = useQuestion()
	if (!question) return null

	const { title, isActive } = question.data

	return (
		<div className="mb-6">
			<div className="flex items-center justify-between mb-2">
				<h1 className="text-2xl font-bold">{title}</h1>
				<Badge variant={isActive ? 'default' : 'secondary'} className="ml-6">
					{isActive ? 'Activa' : 'Finalizada'}
				</Badge>
			</div>
			{isActive ? (
				<div className="flex items-center text-sm text-muted-foreground">
					<Clock className="mr-2 h-4 w-4" />
					<span>{timeLeft} para votar</span>
				</div>
			) : (
				<div className="flex items-center text-sm text-muted-foreground">
					<AlertTriangle className="mr-2 h-4 w-4" />
					<span>La votación ha finalizado</span>
				</div>
			)}
		</div>
	)
}
