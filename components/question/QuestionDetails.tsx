// External library imports
import { usePrivy } from '@privy-io/react-auth'
import { AlertCircle, ExternalLink } from 'lucide-react'

// Internal component imports
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import PointsToolpit from '@/components/common/PointsToolpit'
// Context imports
import { useQuestion } from '@/contexts/QuestionContext'

// Utility imports
import { formatPoints } from '@/lib/utils/formatters'

/**
 * QuestionDetails Component
 * 
 * Displays the details of a question including:
 * - Question description
 * - Authentication status alerts
 * - User voting points
 * - Voting eligibility status
 * 
 * The component handles three states:
 * 1. User not authenticated
 * 2. User authenticated but has no points
 * 3. User authenticated with points (can vote or has already voted)
 */
export default function QuestionDetails() {
	const { authenticated } = usePrivy()
	const { question } = useQuestion()
	if (!question) return null

	const { description } = question.data
	const totalPoints = question.user.pointsAtDeadline
	const canVote = question.user.canVote
	const userPointsAtDeadline = question.user.pointsAtDeadline

	return (
		<Card className="mb-6">
			<CardContent className="pt-6">
				<p className="mb-4 text-muted-foreground">{description}</p>
				{!authenticated ? (
					<Alert variant="destructive" className="mb-4">
						<AlertCircle className="h-4 w-4" />
						<p className="ml-2">
							Debes estar conectado para votar. Hacé click en el botón &quot;Conectar&quot; de arriba.
						</p>
					</Alert>
				) : (userPointsAtDeadline == BigInt(0) ? (
					<Alert variant="destructive" className="mb-4">
						<AlertCircle className="h-4 w-4" />
						<div className="ml-2 flex flex-col space-y-2">
							<p>
								No tienes puntos para votar. Visita tu perfil para obtener sellos y ganar puntos.
							</p>
							<Button
								variant="outline"
								size="sm"
								className="w-fit"
								onClick={() => window.open('/profile', '_blank')}
							>
								<ExternalLink className="mr-2 h-4 w-4" />
								Ir a Mi Perfil
							</Button>
						</div>
					</Alert>
				) : (
					<div className="flex justify-between items-center bg-muted p-3 rounded-lg">
						<p className="text-sm font-medium flex items-center gap-2">
							Tus puntos: <span className="tetext-sm font-medium flex items-center gap-2xt-primary">{formatPoints(totalPoints)}</span>
							<PointsToolpit />
						</p>
						{canVote ? (
							<Badge variant="outline" className="bg-primary text-primary-foreground">
								Puedes votar
							</Badge>
						) : (
							<Badge variant="outline" className="bg-secondary text-secondary-foreground">
								Ya votaste
							</Badge>
						)}
					</div>
				))}
			</CardContent>
		</Card>
	)
}
