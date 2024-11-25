import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { QuestionView } from '@/lib/onchain/types/interfaces'
import { useReadContract } from 'wagmi'
import { contractsGetQuestion } from '@/lib/onchain/contracts'
import { usePrivy } from '@privy-io/react-auth'
import { useSpace } from './SpaceContext'
import { OptionView } from '@/lib/onchain/types/interfaces'
import { usePlasa } from './PlasaContext'

/**
 * Interface defining the shape of the Question context
 */
interface QuestionContextType {
	question: QuestionView | null
	isLoading: boolean
	isError: boolean
	error: Error | null
	refetch: () => void
	setQuestion: (question: QuestionView) => void
	timeLeft: string
	options: OptionView[]
}

/**
 * Interface for QuestionProvider props
 */
interface QuestionProviderProps {
	children: ReactNode
	questionAddress: string
}

// Create the Question context
const QuestionContext = createContext<QuestionContextType | undefined>(undefined)

// Add at the top with other constants
const VOTING_ENDED_MESSAGE = 'Votación finalizada'

/**
 * QuestionProvider component that manages the state and logic for a question
 * Handles loading question data, countdown timer, and error states
 */
export function QuestionProvider({ children, questionAddress }: QuestionProviderProps) {
	const { isLoading: isLoadingSpace } = useSpace()

	const [question, setQuestion] = useState<QuestionView | null>(null)
	const [timeLeft, setTimeLeft] = useState<string>('')

	const { username } = usePlasa()

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

		const newQuestion = questionData as unknown as QuestionView
		const isDifferent = !question ||
			Object.keys(newQuestion).some(key => {
				const newVal = newQuestion[key as keyof QuestionView]
				const oldVal = question[key as keyof QuestionView]
				return newVal !== oldVal
			})

		if (isDifferent) {
			setQuestion(newQuestion)
		}

		if (!newQuestion.data.isActive) {
			if (timeLeft !== VOTING_ENDED_MESSAGE) {
				setTimeLeft(VOTING_ENDED_MESSAGE)
			}
			return
		}

		const updateTimeLeft = () => {
			const now = Date.now()
			const remaining = Number(newQuestion.data.deadline) * 1000 - now

			if (remaining <= 0) {
				if (timeLeft !== VOTING_ENDED_MESSAGE) {
					setTimeLeft(VOTING_ENDED_MESSAGE)
				}
				return
			}

			const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
			const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
			const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
			const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
			const newTimeLeft = `${days}d ${hours}h ${minutes}m ${seconds}s`

			if (newTimeLeft !== timeLeft) {
				setTimeLeft(newTimeLeft)
			}
		}

		updateTimeLeft()
		const timer = setInterval(updateTimeLeft, 1000)
		return () => clearInterval(timer)
	}, [questionData, timeLeft])

	// Add useEffect to refetch when user auth changes
	useEffect(() => {
		if (user) {
			refetch()
		}
	}, [user, refetch])

	const value = {
		question,
		isLoading,
		isError,
		error,
		refetch,
		setQuestion,
		timeLeft,
		options: question?.options || []
	}

	return <QuestionContext.Provider value={value}>{children}</QuestionContext.Provider>
}

/**
 * Custom hook to access the Question context
 * @throws {Error} If used outside of QuestionProvider
 * @returns {QuestionContextType} The question context value
 */
export function useQuestion() {
	const context = useContext(QuestionContext)
	if (context === undefined) {
		throw new Error('useQuestion must be used within a QuestionProvider')
	}
	return context
} 