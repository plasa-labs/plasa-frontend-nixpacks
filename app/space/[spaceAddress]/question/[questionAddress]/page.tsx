'use client'

import { useParams } from 'next/navigation'
import { Question } from './components/Question'

export default function QuestionPage() {
	const { spaceAddress, questionAddress } = useParams()
	return <Question spaceAddress={spaceAddress as string} questionAddress={questionAddress as string} />
}
