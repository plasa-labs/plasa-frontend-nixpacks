"use client"

import { useState } from "react"
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { usePrivy } from "@privy-io/react-auth"
import { useQuestion } from "@/contexts/QuestionContext"
import { OptionView } from "@/lib/onchain/types/interfaces"
import { QuestionOpenOptionCard } from "./QuestionOpenOptionCard"

interface QuestionOpenOptionsListProps {
	onVote: (index: number) => void
}

export function QuestionOpenOptionsList({ onVote }: QuestionOpenOptionsListProps) {
	const [displayCount, setDisplayCount] = useState(10)
	const { question } = useQuestion()
	const { user } = usePrivy()

	if (!question) return null

	const { options } = question
	const userAddress = user?.smartWallet?.address

	const sortOptions = (options: OptionView[]) => {
		return options
			.map((option, index) => ({ ...option, id: index }))
			.slice(1)
			.sort((a, b) => {
				if (userAddress) {
					const aIsUser = a.data.proposer === userAddress
					const bIsUser = b.data.proposer === userAddress

					if (aIsUser && !bIsUser) return -1
					if (!aIsUser && bIsUser) return 1
				}
				return Number(b.data.pointsAtDeadline) - Number(a.data.pointsAtDeadline)
			})
	}

	const handleShowMore = () => {
		setDisplayCount(prevCount => Math.min(prevCount + 10, options.length - 1))
	}

	const sortedOptions = sortOptions(options)

	return (
		<div>
			<div className="space-y-4">
				{sortedOptions.map((option) => (
					<QuestionOpenOptionCard
						key={option.id}
						id={option.id}
						option={option}
						onVote={() => onVote(option.id)}
					/>
				))}
			</div>
			{displayCount < options.length - 1 && (
				<Button
					onClick={handleShowMore}
					className="w-full mt-4"
					variant="outline"
				>
					<ChevronDown className="mr-2 h-4 w-4" />
					Mostrar más opciones
				</Button>
			)}
		</div>
	)
}