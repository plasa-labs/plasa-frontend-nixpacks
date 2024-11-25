"use client"

import { useState, useCallback } from "react"
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { usePrivy } from "@privy-io/react-auth"
import { useQuestion } from "@/contexts/QuestionContext"
import { OptionView } from "@/lib/onchain/types/interfaces"
import { QuestionOpenOptionCard } from "./QuestionOpenOptionCard"

export function QuestionOpenOptionsList() {
	const [displayCount, setDisplayCount] = useState(10)
	const { question, options } = useQuestion()
	const { user } = usePrivy()

	const userAddress = user?.smartWallet?.address

	const sortOptions = useCallback((options: OptionView[]) => {
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
	}, [userAddress])

	if (!question) return null

	const handleShowMore = () => {
		setDisplayCount(prevCount => Math.min(prevCount + 10, options.length - 1))
	}

	const sortedOptions = sortOptions(options).slice(0, displayCount)

	return (
		<div>
			<div className="space-y-4">
				{sortedOptions.map((option) => (
					<QuestionOpenOptionCard
						key={`${option.id}-${options.length}`}
						id={option.id}
						option={option}
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