import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils/formatters'
// import { AddressScanLink } from '@/components/common/ScanLink'
import { useQuestion } from "@/contexts/QuestionContext"
// import { useSpace } from "@/contexts/SpaceContext"

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
	// const { space } = useSpace()

	if (!question) return null

	// const spaceAddress = space?.data.contractAddress as string

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="text-base font-semibold">Información de la votación</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<p className="font-semibold">Inicio</p>
							<p className="text-muted-foreground">{formatDate(question.data.kickoff)}</p>
						</div>
						<div>
							<p className="font-semibold">Fin</p>
							<p className="text-muted-foreground">{formatDate(question.data.deadline)}</p>
						</div>

						{/* <div>
							<p className="font-semibold">Creador</p>
							<AddressScanLink address={question.data.creator} />
						</div>
						<div>
							<p className="font-semibold">Contrato de la votación</p>
							<AddressScanLink address={question.data.contractAddress} />
						</div>
						{space && (
							<>
								<div>
									<p className="font-semibold">Contrato de los puntos</p>
									<AddressScanLink address={question.points.data.contractAddress} />
								</div>
								<div>
									<p className="font-semibold">Contrato del espacio</p>
									<AddressScanLink address={spaceAddress} />
								</div>
							</>
						)} */}
					</div>
				</CardContent>
			</Card>
		</>
	)
}
