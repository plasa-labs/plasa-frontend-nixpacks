'use client'

import { useParams } from 'next/navigation'
import { Question } from '@/components/question/Question'

export default function QuestionPage() {
	const { questionAddress } = useParams()
	return <Question spaceAddress={process.env.NEXT_PUBLIC_SPACE_ADDRESS as string} questionAddress={questionAddress as string} />
}
