'use client'

// External imports
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Internal UI components
import { Button } from '@/components/ui/button'

// Question-specific components
import QuestionHeader from './QuestionHeader'
import QuestionDetails from './QuestionDetails'
import QuestionVotingOptions from './QuestionVotingOptions'
import QuestionVotingProgress from './QuestionVotingProgress'
import QuestionInformation from './QuestionInformation'
import QuestionLoading from './QuestionLoading'
import QuestionRecentVotes from './QuestionRecentVotes'

// Contexts
import { useSpace } from '@/contexts/SpaceContext'
import { QuestionProvider, useQuestion } from '@/contexts/QuestionContext'

/**
 * Props interface for the Question component
 */
interface QuestionProps {
	questionAddress: string
}

/**
 * Main Question component that wraps the content with the QuestionProvider
 * @param {QuestionProps} props - Component props containing the question address
 * @returns {JSX.Element} Rendered Question component
 */
export default function Question({ questionAddress }: QuestionProps) {
	return (
		<QuestionProvider questionAddress={questionAddress}>
			<QuestionContent />
		</QuestionProvider>
	)
}

/**
 * Internal component that handles the main question content and layout
 * Manages loading states and error handling
 * @returns {JSX.Element} Rendered question content
 */
function QuestionContent() {
	const { question, isLoading, isError } = useQuestion()
	const { space } = useSpace()

	if (isLoading) return <QuestionLoading />
	if (isError || !question) return <div>Error al cargar los datos</div>

	return (
		<div className='main-container'>
			<Link href='/' passHref prefetch={true}>
				<Button variant='outline' className='mb-6'>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Volver a {space?.data.name ? space.data.name : 'Espacio'}
				</Button>
			</Link>

			<QuestionHeader />

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-2 space-y-6'>
					<QuestionDetails />
					<QuestionVotingOptions />
					<QuestionVotingProgress />
				</div>
				<div className='space-y-6'>
					<QuestionInformation />
					<QuestionRecentVotes />
				</div>
			</div>
		</div>
	)
}