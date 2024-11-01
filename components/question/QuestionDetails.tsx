import { AlertCircle, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { formatPoints } from '@/lib/utils/formatters'

interface QuestionDetailsProps {
	description: string
	totalPoints: number
	canVote: boolean
	userPointsAtDeadline: number
	isConnected: boolean
}

export const QuestionDetails = ({
	description,
	totalPoints,
	canVote,
	userPointsAtDeadline,
	isConnected
}: QuestionDetailsProps) => (
	<Card className="mb-6">
		<CardContent className="pt-6">
			<p className="mb-4 text-muted-foreground">{description}</p>
			{!isConnected ? (
				<Alert variant="destructive" className="mb-4">
					<AlertCircle className="h-4 w-4" />
					<p className="ml-2">
						Debes estar conectado para votar. Hacé click en el botón &quot;Conectar&quot; de arriba.
					</p>
				</Alert>
			) : (userPointsAtDeadline == 0 ? (
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
					<p className="text-sm font-medium">
						Tus puntos: <span className="text-primary">{formatPoints(totalPoints)}</span>
					</p>
					{canVote ? (
						<Badge variant="outline" className="bg-primary text-primary-foreground">
							Puedes votar
						</Badge>
					) : (
						<Badge variant="outline" className="bg-secondary text-secondary-foreground">
							Ya has votado
						</Badge>
					)}
				</div>
			))}
		</CardContent>
	</Card>
)
