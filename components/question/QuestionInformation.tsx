import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils/formatters'
import { AddressScanLink } from '@/components/common/ScanLink'
import { useQuestion } from "@/contexts/QuestionContext"
import { useSpace } from "@/contexts/SpaceContext"

/**
 * QuestionInformation Component
 * 
 * Displays detailed information about a voting question including:
 * - Total vote count
 * - Start and end dates
 * - Contract addresses
 * - Creator information
 * 
 * Uses data from QuestionContext and SpaceContext
 */
export default function QuestionInformation() {
	const { question } = useQuestion()
	const { space } = useSpace()

	if (!question) return null

	const spaceAddress = space?.data.contractAddress as string

	return (
		<>
			<Card>
				<CardContent className="pt-6">
					<h2 className="text-base font-semibold mb-2">Total de Votos</h2>
					<p className="text-3xl font-bold">{question.data.voteCount.toString()}</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Información de la votación</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<p className="font-semibold">Total de Votos</p>
							<p className="text-muted-foreground">{question.data.voteCount.toString()}</p>
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
							<p className="font-semibold">Contrato de la votación</p>
							<AddressScanLink address={question.data.contractAddress} />
						</div>
						<div>
							<p className="font-semibold">Creador</p>
							<AddressScanLink address={question.data.creator} />
						</div>
						{space && (
							<div>
								<p className="font-semibold">Contrato del Espacio</p>
								<AddressScanLink address={spaceAddress} />
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</>
	)
}
