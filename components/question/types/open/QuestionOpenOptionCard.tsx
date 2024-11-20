"use client"

import { useState } from "react"
import { ThumbsUp, ChevronDown, ChevronUp, Flag } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import TransactionButton from "@/components/common/TransactionButton"
import { useQuestion } from "@/contexts/QuestionContext"
import { OptionView } from "@/lib/onchain/types/interfaces"
import { formatPoints } from "@/lib/utils/formatters"
import { contractsVote, contractsVetoOption, contractsLiftOptionVeto } from "@/lib/onchain/contracts"
import { useSpace } from "@/contexts/SpaceContext"

interface QuestionOpenOptionCardProps {
	option: OptionView
	id: number
	onVote: (id: number) => void
}

export function QuestionOpenOptionCard({ option, id, onVote }: QuestionOpenOptionCardProps) {
	const { question, setQuestion } = useQuestion()
	const { space } = useSpace()
	const [isDescriptionVisible, setIsDescriptionVisible] = useState(false)

	if (!question) return null
	if (!space) return null

	const isActive = question.data.isActive
	const pointsAtDeadline = option.data.pointsAtDeadline
	const proposer = option.data.proposerName
	const title = option.data.title
	const description = option.data.description
	const userVoted = option.user.voted
	const voteCount = option.data.voteCount
	const questionAddress = question?.data.contractAddress as `0x${string}`
	const pointsSymbol = question?.points.data.symbol
	const isVetoed = option.data.isVetoed

	const canVeto = space.user.permissions.VetoOpenQuestionOption
	const canLiftVeto = space.user.permissions.LiftVetoOpenQuestionOption

	if (!canLiftVeto && isVetoed) return null

	const handleVeto = async () => {
		const updatedOptions = question!.options.map((option, index) => {
			if (index === id) return { ...option, data: { ...option.data, isVetoed: true } }
			return option
		})
		setQuestion({ ...question, options: updatedOptions })
	}

	const handleLiftVeto = async () => {
		const updatedOptions = question!.options.map((option, index) => {
			if (index === id) return { ...option, data: { ...option.data, isVetoed: false } }
			return option
		})
		setQuestion({ ...question, options: updatedOptions })
	}

	return (
		<Card className={`mb-4 hover:shadow-md transition-shadow duration-200 ${isVetoed ? 'opacity-60' : ''}`}>
			<CardHeader className="pb-2">
				<div className="flex justify-between items-center">
					<CardTitle className="font-semibold">{title}</CardTitle>
					<Badge variant="secondary" className="text-xs">
						{formatPoints(pointsAtDeadline)} {pointsSymbol}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="pb-2">
				<Button
					variant="ghost"
					size="sm"
					className="p-0 h-auto font-normal"
					onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
				>
					{isDescriptionVisible ? (
						<ChevronUp className="h-4 w-4 mr-2" />
					) : (
						<ChevronDown className="h-4 w-4 mr-2" />
					)}
					{isDescriptionVisible ? "Ocultar descripción" : "Ver descripción"}
				</Button>
				{isDescriptionVisible && (
					<p className="text-sm text-muted-foreground mt-2">{description}</p>
				)}
			</CardContent>
			<CardFooter className="flex justify-between items-center pt-2">
				<div className="flex items-center space-x-2">
					<Avatar className="h-6 w-6">
						<AvatarImage src={`https://avatar.vercel.sh/${proposer}.png`} alt={proposer} />
						<AvatarFallback>{proposer}</AvatarFallback>
					</Avatar>
					<span className="text-xs text-muted-foreground">
						{proposer}
					</span>
				</div>
				<div className="flex items-center space-x-2">
					{canVeto && !isVetoed && (
						<TransactionButton
							transactionData={contractsVetoOption(questionAddress, id)}
							onSuccess={handleVeto}
							className="bg-primary-foreground text-primary hover:bg-primary-foreground/80 border-primary"
						>
							<Flag className="h-4 w-4" />
						</TransactionButton>
					)}
					{canLiftVeto && isVetoed && (
						<TransactionButton
							transactionData={contractsLiftOptionVeto(questionAddress, id)}
							onSuccess={handleLiftVeto}
							className="bg-destructive text-destructive-foreground"
						>
							<Flag className="h-4 w-4" />
						</TransactionButton>
					)}
					{isActive && !userVoted ? (
						<TransactionButton
							transactionData={contractsVote(questionAddress, id)}
							onSuccess={() => onVote(id)}
						>
							<div className="flex items-center">
								<ThumbsUp className={`mr-4 h-4 w-4 ${userVoted ? 'fill-current' : ''}`} />
								{voteCount}
							</div>
						</TransactionButton>)
						:
						(
							<div className="inline-flex items-center justify-center text-sm font-medium h-10 px-4 py-2">
								<ThumbsUp className={`mr-4 h-4 w-4 ${userVoted ? 'fill-current' : ''}`} />
								{voteCount}
							</div>
						)}
				</div>
			</CardFooter>
		</Card >
	)
}