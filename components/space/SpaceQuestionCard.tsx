'use client'

import { useRouter } from 'next/navigation'
import { Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QuestionPreview } from '@/lib/onchain/types/interfaces'
import { formatPoints } from '@/lib/utils/formatters'

interface SpaceQuestionCardProps {
	question: QuestionPreview
}

export function SpaceQuestionCard({ question }: SpaceQuestionCardProps) {
	const router = useRouter()

	const isActive = question.data.isActive
	const canVote = question.user.canVote
	const title = question.data.title
	const voteCount = BigInt(question.data.voteCount)
	const deadlineTimestamp = Number(question.data.deadline)
	const timeRemaining = new Date(deadlineTimestamp * 1000).getTime() - Date.now()
	const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

	return (
		<Card
			className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
			onClick={() => router.push(`/question/${question.data.contractAddress}`)}
		>
			<CardHeader>
				<div className="flex justify-between items-start">
					<CardTitle className="text-lg">{title}</CardTitle>
					<Badge variant={isActive ? "default" : "secondary"} className="ml-2">
						{isActive ? 'Activa' : 'Cerrada'}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex justify-between items-center text-sm text-gray-500 mb-4">
					<span>
						{isActive ? `Quedan ${daysRemaining} días` : `Terminó hace ${Math.abs(daysRemaining)} días`}
					</span>
					<span>{voteCount.toString()} votos</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-sm font-medium">
						Tus puntos para esta votación: {formatPoints(question.user.pointsAtDeadline)}
					</span>
					{canVote && isActive ? (
						<Button variant="default" size="sm" onClick={() => router.push(`/question/${question.data.contractAddress}`)}>
							Votar
						</Button>
					) : (
						<Button variant="outline" size="sm" onClick={() => router.push(`/question/${question.data.contractAddress}`)}>
							<Eye className="mr-2 h-4 w-4" /> Ver
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
