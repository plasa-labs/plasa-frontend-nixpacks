'use client'

import { PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuestionPreview } from '@/lib/onchain/types/questions'
import { QuestionCard } from './QuestionCard'

interface QuestionsListProps {
	questions: QuestionPreview[]
	canCreateQuestion: boolean
	spaceAddress: string
}

export function QuestionsList({ questions, canCreateQuestion, spaceAddress }: QuestionsListProps) {
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
					<QuestionCard key={index} question={question} spaceAddress={spaceAddress} />
				))}
			</CardContent>
		</Card>
	)
}