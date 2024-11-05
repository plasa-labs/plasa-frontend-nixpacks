import { Clock, AlertTriangle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { useQuestion } from '@/contexts/QuestionContext'

/**
 * QuestionHeader Component
 * 
 * Displays the header section of a question, including:
 * - Question title
 * - Status badge (Active/Finished)
 * - Timer or completion message
 * 
 * Uses the QuestionContext to access question data and remaining time
 */
export default function QuestionHeader() {
	const { question, timeLeft } = useQuestion()

	// Early return if question data is not available
	if (!question) return null

	const { title, isActive } = question.data

	return (
		<div className='mb-6'>
			<div className='flex items-center justify-between mb-2'>
				<h1 className='text-2xl font-bold'>{title}</h1>
				<Badge variant={isActive ? 'default' : 'secondary'} className='ml-6'>
					{isActive ? 'Activa' : 'Finalizada'}
				</Badge>
			</div>
			{isActive ? (
				<div className='flex items-center text-sm text-muted-foreground'>
					<Clock className='mr-2 h-4 w-4' />
					<span>{timeLeft} para votar</span>
				</div>
			) : (
				<div className='flex items-center text-sm text-muted-foreground'>
					<AlertTriangle className='mr-2 h-4 w-4' />
					<span>La votación ha finalizado</span>
				</div>
			)}
		</div>
	)
}
