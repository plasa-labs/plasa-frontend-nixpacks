'use client'

import { PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SpaceQuestionCard } from './SpaceQuestionCard'
import { useSpace } from '@/contexts/SpaceContext'

export function SpaceQuestionsList() {
	const { space } = useSpace()
	const canCreateQuestion = space.user.permissions.CreateFixedQuestion ||
		space.user.permissions.CreateOpenQuestion
	const questions = space.questions

	return (
		<Card className="mb-6">
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle>Votaciones</CardTitle>
					<Button size="sm" disabled={!canCreateQuestion}>
						<PlusCircle className="mr-2 h-4 w-4" /> Nueva votación
					</Button>
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
