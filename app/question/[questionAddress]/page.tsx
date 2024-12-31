'use client'

import { useParams } from 'next/navigation'
import Question from '@/components/question/Question'
import RequireRegistration from '@/components/auth/RequireRegistration'

/**
 * Interface defining the expected URL parameters for the question page.
 * @property {string} questionAddress - The blockchain address of the question
 */
interface QuestionPageParams {
	questionAddress: string
	[key: string]: string
}

export default function QuestionPage() {
	const { questionAddress } = useParams<QuestionPageParams>()
	return (
		<RequireRegistration>
			<Question questionAddress={questionAddress} />
		</RequireRegistration>
	)
}
