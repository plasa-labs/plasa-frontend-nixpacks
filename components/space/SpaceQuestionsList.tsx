'use client'

// External imports
import { PlusCircle } from 'lucide-react'

// Internal UI component imports
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SpaceQuestionCard from './SpaceQuestionCard'

// Contexts
import { useSpace } from '@/contexts/SpaceContext'

/**
 * SpaceQuestionsList Component
 * 
 * Renders a list of questions for a space with the ability to create new questions
 * if the user has the appropriate permissions. Questions are displayed using SpaceQuestionCard
 * components within a styled card container.
 */
export default function SpaceQuestionsList() {
	const { space } = useSpace()
	if (!space) return null
	const canCreateQuestion = space.user.permissions.CreateFixedQuestion ||
		space.user.permissions.CreateOpenQuestion

	// Sort questions by deadline in descending order (latest first)
	const questions = [...space.questions].sort((a, b) => {
		return Number(b.data.deadline) - Number(a.data.deadline)
	})

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle>Votaciones</CardTitle>
					{canCreateQuestion && (
						<Button size="sm" disabled={!canCreateQuestion}>
							<PlusCircle className="mr-2 h-4 w-4" /> Nueva votación
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent>
				{questions.map((question, index) => (
					<SpaceQuestionCard
						key={index}
						question={question}
					/>
				))}
			</CardContent>
		</Card>
	)
}
