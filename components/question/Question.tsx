'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useReadContract } from 'wagmi'
import { Button } from '@/components/ui/button'
import { usePrivy } from '@privy-io/react-auth'

import { QuestionHeader } from './QuestionHeader'
import { QuestionDetails } from './QuestionDetails'
import { QuestionVotingOptions } from './QuestionVotingOptions'
import { QuestionVotingProgress } from './QuestionVotingProgress'
import { QuestionInformation } from './QuestionInformation'
import { QuestionLoading } from './QuestionLoading'

import { contractsGetQuestion } from '@/lib/onchain/contracts'
import { QuestionView } from '@/lib/onchain/types/interfaces'
import { useSpace } from '@/contexts/SpaceContext'

interface QuestionProps {
	spaceAddress: string
	questionAddress: string
}

export function Question({ spaceAddress, questionAddress }: QuestionProps) {
	const { user } = usePrivy()

	const userAddress = user?.smartWallet?.address as `0x${string}`

	const [timeLeft, setTimeLeft] = useState<string>('')

	const contract = contractsGetQuestion(questionAddress as `0x${string}`, userAddress)
	const { data: questionData, isLoading, isError } = useReadContract(contract)

	const space = useSpace()

	useEffect(() => {
		if (questionData) {
			const question = questionData as unknown as QuestionView
			if (question.data.isActive) {
				const updateTimeLeft = () => {
					const now = Date.now()
					const remaining = Number(question.data.deadline) * 1000 - now
					if (remaining <= 0) {
						setTimeLeft('Votación finalizada')
					} else {
						const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
						const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
						const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
						const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
						setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
					}
				}

				updateTimeLeft()
				const timer = setInterval(updateTimeLeft, 1000)
				return () => clearInterval(timer)
			} else {
				setTimeLeft('Votación finalizada')
			}
		}
	}, [questionData])

	const handleVote = async (optionIndex: number) => {
		if (questionData) {
			const updatedQuestionData = { ...questionData } as unknown as QuestionView
			updatedQuestionData.options[optionIndex].data.voteCount = updatedQuestionData.options[optionIndex].data.voteCount + BigInt(1)
			updatedQuestionData.options[optionIndex].user.voted = true
			updatedQuestionData.user.canVote = false
			updatedQuestionData.data.voteCount = updatedQuestionData.data.voteCount + BigInt(1)
			updatedQuestionData.options[optionIndex].data.pointsAtDeadline = updatedQuestionData.options[optionIndex].data.pointsAtDeadline + updatedQuestionData.user.pointsAtDeadline
		}
	}

	if (isLoading) return <QuestionLoading />
	if (isError || !questionData) return <div>Error al cargar los datos</div>

	const question = questionData as unknown as QuestionView

	return (
		<div className='main-container'>
			<Link href={`/`} passHref>
				<Button variant='outline' className='mb-6'>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Volver a {space?.space?.data.name ? space.space.data.name : 'Espacio'}
				</Button>
			</Link>

			<QuestionHeader
				title={question.data.title}
				active={question.data.isActive}
				timeLeft={timeLeft}
			/>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-2 space-y-6'>
					<QuestionDetails
						description={question.data.description}
						totalPoints={question.user.pointsAtDeadline}
						canVote={question.user.canVote}
						userPointsAtDeadline={question.user.pointsAtDeadline}
					/>
					<QuestionVotingOptions
						options={question.options}
						onVote={handleVote}
						canVote={question.user.canVote}
						active={question.data.isActive}
						questionAddress={questionAddress}
						userPointsAtDeadline={question.user.pointsAtDeadline}
					/>
					<QuestionVotingProgress options={question.options} />
				</div>
				<div className='space-y-6'>
					<QuestionInformation
						spaceData={{
							name: 'Space Name',
							contractAddress: spaceAddress
						}}
						question={question}
					/>
				</div>
			</div>
		</div>
	)
} 