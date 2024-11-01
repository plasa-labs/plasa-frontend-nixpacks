'use client'

import { useRouter } from 'next/navigation'
import { Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QuestionPreview } from '@/lib/onchain/types/questions'
import { formatPoints } from '@/lib/utils/formatters'

interface SpaceQuestionCardProps {
	question: QuestionPreview
	spaceAddress: string
}

export function SpaceQuestionCard({ question }: SpaceQuestionCardProps) {
	const router = useRouter()
	const isActive = question.data.isActive
	const canVote = question.user.canVote
	const deadlineTimestamp = Number(question.data.deadline)
	const timeRemaining = new Date(deadlineTimestamp * 1000).getTime() - Date.now()
	const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

	const handleQuestionClick = () => {
		router.push(`/question/${question.data.contractAddress}`)
	}

	return (
		<Card className="mb-4">
			<CardHeader>
				<div className="flex justify-between items-start">
					<CardTitle className="text-lg">{question.data.title}</CardTitle>
					<Badge variant={isActive ? "default" : "secondary"}>
						{isActive ? 'Activa' : 'Cerrada'}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex justify-between items-center text-sm text-gray-500 mb-4">
					<span>
						{isActive ? `Quedan ${daysRemaining} días` : `Terminó hace ${Math.abs(daysRemaining)} días`}
					</span>
					<span>{BigInt(question.data.voteCount).toString()} votos</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-sm font-medium">
						Tus puntos: {formatPoints(question.user.pointsAtDeadline)}
					</span>
					{canVote && isActive ? (
						<Button variant="default" size="sm" onClick={handleQuestionClick}>
							Votar
						</Button>
					) : (
						<Button variant="outline" size="sm" onClick={handleQuestionClick}>
							<Eye className="mr-2 h-4 w-4" /> Ver
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
