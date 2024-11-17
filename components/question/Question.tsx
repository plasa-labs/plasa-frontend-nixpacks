'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Common question components
import QuestionHeader from './QuestionHeader'
import QuestionDetails from './QuestionDetails'
import QuestionInformation from './QuestionInformation'
import QuestionLoading from './QuestionLoading'
import QuestionRecentVotes from './QuestionRecentVotes'

// Question type specific components
import QuestionFixed from './types/fixed/QuestionFixed'
import QuestionOpen from './types/open/QuestionOpen'

import { QuestionType } from '@/lib/onchain/types/interfaces'

// Contexts
import { useSpace } from '@/contexts/SpaceContext'
import { QuestionProvider, useQuestion } from '@/contexts/QuestionContext'

interface QuestionProps {
	questionAddress: string
}

export default function Question({ questionAddress }: QuestionProps) {
	return (
		<QuestionProvider questionAddress={questionAddress}>
			<QuestionContent />
		</QuestionProvider>
	)
}

function QuestionContent() {
	const { question, isLoading, isError } = useQuestion()
	const { space } = useSpace()

	if (isLoading) return <QuestionLoading />
	if (isError || !question) return <div>Error al cargar los datos</div>

	const QuestionTypeComponent = question.data.questionType === QuestionType.Fixed ? QuestionFixed : QuestionOpen

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
					<QuestionTypeComponent />
				</div>
				<div className='space-y-6'>
					<QuestionRecentVotes />
					<QuestionInformation />
				</div>
			</div>
		</div>
	)
}