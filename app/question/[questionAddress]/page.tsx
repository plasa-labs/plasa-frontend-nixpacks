'use client'

import { useParams } from 'next/navigation'
import { Question } from '@/components/question/Question'

export default function QuestionPage() {
	const { questionAddress } = useParams()
	return <Question questionAddress={questionAddress as string} />
}
