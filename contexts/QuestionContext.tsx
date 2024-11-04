import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { QuestionView } from '@/lib/onchain/types/interfaces'
import { useReadContract } from 'wagmi'
import { contractsGetQuestion } from '@/lib/onchain/contracts'
import { usePrivy } from '@privy-io/react-auth'
import { useSpace } from './SpaceContext'

interface QuestionContextType {
	question: QuestionView | null
	isLoading: boolean
	isError: boolean
	error: Error | null
	refetch: () => void
	setQuestion: (question: QuestionView) => void
	timeLeft: string
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined)

export function QuestionProvider({
	children,
	questionAddress
}: {
	children: ReactNode
	questionAddress: string
}) {
	const { isLoading: isLoadingSpace } = useSpace()

	const [question, setQuestion] = useState<QuestionView | null>(null)
	const [timeLeft, setTimeLeft] = useState<string>('')

	const { user } = usePrivy()
	const userAddress = user?.smartWallet?.address as `0x${string}`

	const contract = contractsGetQuestion(questionAddress as `0x${string}`, userAddress)
	const {
		data: questionData,
		isLoading: isLoadingQuestion,
		isError,
		error,
		refetch
	} = useReadContract(contract)

	const isLoading = isLoadingSpace || isLoadingQuestion

	useEffect(() => {
		if (!questionData) return

		const question = questionData as unknown as QuestionView
		setQuestion(question)

		if (!question.data.isActive) {
			setTimeLeft('Votación finalizada')
			return
		}

		const updateTimeLeft = () => {
			const now = Date.now()
			const remaining = Number(question.data.deadline) * 1000 - now

			if (remaining <= 0) {
				setTimeLeft('Votación finalizada')
				return
			}

			const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
			const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
			const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
			const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
			setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
		}

		updateTimeLeft()
		const timer = setInterval(updateTimeLeft, 1000)
		return () => clearInterval(timer)
	}, [questionData, questionAddress])

	const value = {
		question,
		isLoading,
		isError,
		error,
		refetch,
		setQuestion,
		timeLeft
	}

	return <QuestionContext.Provider value={value}>{children}</QuestionContext.Provider>
}

export function useQuestion() {
	const context = useContext(QuestionContext)
	if (context === undefined) {
		throw new Error('useQuestion must be used within a QuestionProvider')
	}
	return context
} 