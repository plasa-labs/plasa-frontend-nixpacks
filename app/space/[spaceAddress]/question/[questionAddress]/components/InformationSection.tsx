import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuestionView, QuestionType } from '@/lib/onchain/types/questions'
import { abbreviateAddress, scanLink, formatDate } from '../utils/formatters'

interface InformationSectionProps {
	spaceData: {
		name: string
		contractAddress: string
	}
	question: QuestionView
}

const getQuestionTypeString = (questionType: QuestionType): string => {
	switch (questionType) {
		case QuestionType.Open:
			return "Abierta"
		case QuestionType.Fixed:
			return "Cerrado"
		default:
			return "Cerrado"
	}
}

export const InformationSection = ({ spaceData, question }: InformationSectionProps) => (
	<>
		<Card>
			<CardContent className="pt-6">
				<h2 className="text-base font-semibold mb-2">Total de Votos</h2>
				<p className="text-3xl font-bold">{question.data.voteCount.toString()}</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader>
				<CardTitle>Información de la Pregunta</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
					<div>
						<p className="font-semibold">Espacio</p>
						<p className="text-muted-foreground">{spaceData.name}</p>
					</div>
					<div>
						<p className="font-semibold">Contrato del Espacio</p>
						<a href={scanLink(spaceData.contractAddress)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">
							{abbreviateAddress(spaceData.contractAddress)}
							<ExternalLink className="h-3 w-3 ml-1" />
						</a>
					</div>
					<div>
						<p className="font-semibold">Contrato del Tema</p>
						<a href={scanLink(question.data.contractAddress)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">
							{abbreviateAddress(question.data.contractAddress)}
							<ExternalLink className="h-3 w-3 ml-1" />
						</a>
					</div>
					<div>
						<p className="font-semibold">Tipo de Tema</p>
						<p className="text-muted-foreground">{getQuestionTypeString(question.data.questionType)}</p>
					</div>
					<div>
						<p className="font-semibold">Inicio</p>
						<p className="text-muted-foreground">{formatDate(question.data.kickoff)}</p>
					</div>
					<div>
						<p className="font-semibold">Fin</p>
						<p className="text-muted-foreground">{formatDate(question.data.deadline)}</p>
					</div>
					<div>
						<p className="font-semibold">Total de Votos</p>
						<p className="text-muted-foreground">{question.data.voteCount.toString()}</p>
					</div>
					<div>
						<p className="font-semibold">Creador</p>
						<a href={scanLink(question.data.creator)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">
							{abbreviateAddress(question.data.creator)}
							<ExternalLink className="h-3 w-3 ml-1" />
						</a>
					</div>
				</div>
			</CardContent>
		</Card>
	</>
)
