import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle } from "lucide-react"

interface QuestionHeaderProps {
	title: string
	active: boolean
	timeLeft: string
}

export const QuestionHeader = ({ title, active, timeLeft }: QuestionHeaderProps) => (
	<div className="mb-6">
		<div className="flex items-center justify-between mb-2">
			<h1 className="text-2xl font-bold">{title}</h1>
			<Badge variant={active ? 'default' : 'secondary'} className="ml-6">
				{active ? 'Activa' : 'Finalizada'}
			</Badge>
		</div>
		{active ? (
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
