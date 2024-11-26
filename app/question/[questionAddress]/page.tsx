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

/**
 * QuestionPage Component
 * 
 * A client-side page component that displays a single question's details and interactions.
 * Extracts the question address from the URL parameters and passes it to the Question component.
 * 
 * @component
 * @example
 * // Route: /question/0x123...
 * <QuestionPage />
 * 
 * @returns {JSX.Element} A rendered Question component with the specified question address
 */
export default function QuestionPage(): JSX.Element {
	const { questionAddress } = useParams<QuestionPageParams>()
	return (
		<RequireRegistration>
			<Question questionAddress={questionAddress} />
		</RequireRegistration>
	)
}
