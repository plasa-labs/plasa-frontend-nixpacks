'use client'

// React and Next.js imports
import { useRouter } from 'next/navigation'

// Third-party imports
import { Eye, Vote } from 'lucide-react'

// UI Component imports
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import PointsToolpit from '@/components/common/PointsToolpit'
import QuestionTags from '@/components/common/QuestionTags'
import QuestionStatus from '@/components/common/QuestionStatus'
// Types and utilities
import { QuestionPreview } from '@/lib/onchain/types/interfaces'
// import { formatPoints } from '@/lib/utils/formatters'

/**
 * Props interface for the SpaceQuestionCard component
 */
interface SpaceQuestionCardProps {
	question: QuestionPreview
}

export default function SpaceQuestionCard({ question }: SpaceQuestionCardProps) {
	const router = useRouter()

	// Extract question data
	const isActive = question.data.isActive
	const canVote = question.user.canVote
	const title = question.data.title
	const voteCount = BigInt(question.data.voteCount)
	const deadlineTimestamp = Number(question.data.deadline)
	const timeRemaining = new Date(deadlineTimestamp * 1000).getTime() - Date.now()

	// New time calculation
	const days = Math.floor(Math.abs(timeRemaining) / (1000 * 60 * 60 * 24))
	const hours = Math.floor((Math.abs(timeRemaining) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
	const minutes = Math.floor((Math.abs(timeRemaining) % (1000 * 60 * 60)) / (1000 * 60))

	const tags = question.data.tags

	return (
		<Card
			className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
			onClick={() => router.push(`/question/${question.data.contractAddress}`)}
		>
			<CardHeader>
				<div className="flex justify-between items-start">
					<CardTitle className="text-lg">{title}</CardTitle>
					<QuestionStatus isActive={isActive} className="ml-2" />
				</div>
				<QuestionTags tags={tags} />
			</CardHeader>
			<CardContent>
				<div className="flex justify-between items-center text-sm text-gray-500 mb-4">
					<span>
						{isActive
							? `Quedan ${days}d ${hours}h ${minutes}m`
							: `Terminó hace ${days}d ${hours}h ${minutes}m`}
					</span>
					<span>{voteCount.toString()} votos</span>
				</div>
				<div className="flex justify-end items-center">
					{/* <span className="text-sm font-medium flex items-center gap-2">
						Tus puntos para esta votación: {formatPoints(question.user.pointsAtDeadline)}
						<PointsToolpit className="mr-10" />
					</span> */}
					<div className="flex items-center">
						{canVote && isActive ? (
							<Button variant="default" size="sm" onClick={() => router.push(`/question/${question.data.contractAddress}`)}>
								<Vote className="mr-2 h-4 w-4" /> Votar
							</Button>
						) : (
							<Button variant="outline" size="sm" onClick={() => router.push(`/question/${question.data.contractAddress}`)}>
								<Eye className="mr-2 h-4 w-4" /> Ver
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
