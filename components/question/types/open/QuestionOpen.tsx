"use client"

import { useState } from "react"

import { usePrivy } from "@privy-io/react-auth"
import { Plus, ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import TransactionButton from "@/components/common/TransactionButton"

import { OptionView } from "@/lib/onchain/types/interfaces"
import { formatPoints } from "@/lib/utils/formatters"
import { contractsAddOption, contractsVote } from "@/lib/onchain/contracts"

import { useQuestion } from "@/contexts/QuestionContext"
import { useSpace } from "@/contexts/SpaceContext"
import { usePlasa } from "@/contexts/PlasaContext"

interface AddOptionFormProps {
	onAdd: (title: string, description: string) => void
}

interface OptionCardProps {
	option: OptionView
	id: number
	onVote: (id: number) => void
}

interface OptionListProps {
	onVote: (index: number) => void
}

function AddOptionForm({ onAdd }: AddOptionFormProps) {
	const [newOptionTitle, setNewOptionTitle] = useState("")
	const [newOptionDescription, setNewOptionDescription] = useState("")

	const { question } = useQuestion()
	if (!question) return null

	const questionAddress = question?.data.contractAddress as `0x${string}`

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="title">Título</Label>
				<Input
					id="title"
					value={newOptionTitle}
					onChange={(e) => setNewOptionTitle(e.target.value)}
					placeholder="Ingrese el título de la opción"
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="description">Descripción</Label>
				<Textarea
					id="description"
					value={newOptionDescription}
					onChange={(e) => setNewOptionDescription(e.target.value)}
					placeholder="Explicá brevemente por qué es una buena opción"
					rows={4}
				/>
			</div>
			<TransactionButton
				transactionData={contractsAddOption(questionAddress, newOptionTitle, newOptionDescription)}
				className="w-full"
				onSuccess={() => {
					onAdd(newOptionTitle, newOptionDescription)
					setNewOptionTitle("")
					setNewOptionDescription("")
				}}>
				Proponer opción
			</TransactionButton>
		</div>
	)
}

function OptionCard({ option, id, onVote }: OptionCardProps) {
	const { question } = useQuestion()
	const [isDescriptionVisible, setIsDescriptionVisible] = useState(false)

	if (!question) return null

	const isActive = question.data.isActive
	const pointsAtDeadline = option.data.pointsAtDeadline
	const proposer = option.data.proposerName
	const title = option.data.title
	const description = option.data.description
	const userVoted = option.user.voted
	const voteCount = option.data.voteCount
	const questionAddress = question?.data.contractAddress as `0x${string}`

	const pointsSymbol = question?.points.data.symbol

	return (
		<Card className="mb-4 hover:shadow-md transition-shadow duration-200">
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
			</CardFooter>
		</Card >
	)
}

function OptionList({ onVote }: OptionListProps) {
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
					// First, compare if either option is from the user
					const aIsUser = a.data.proposer === userAddress
					const bIsUser = b.data.proposer === userAddress

					if (aIsUser && !bIsUser) return -1
					if (!aIsUser && bIsUser) return 1
				}

				// If both are from the same user (or neither), sort by points
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
					<OptionCard
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

export default function QuestionOpen() {
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const { user } = usePrivy()
	const { space } = useSpace()
	const { question, setQuestion } = useQuestion()
	const { plasa } = usePlasa()

	if (!question) return null
	if (!space) return null
	if (!plasa) return null

	const isActive = question.data.isActive
	const userName = plasa.user.username

	const canAddOption = space.user.permissions.AddOpenQuestionOption

	const handlePropose = async (title: string, description: string) => {
		if (!user) throw new Error("User not found")

		const newOption: OptionView = {
			data: {
				title,
				description,
				proposer: user.smartWallet!.address,
				proposerName: userName,
				voteCount: BigInt(0),
				pointsAtDeadline: BigInt(0),
			},
			user: {
				voted: false
			}
		}

		setQuestion({
			...question!,
			options: [...question.options, newOption]
		})

		setIsDialogOpen(false)
	}


	const handleVote = async (optionIndex: number) => {
		const updatedOptions = question!.options.map((option, index) => {
			if (index === optionIndex) {
				return {
					...option,
					data: {
						...option.data,
						voteCount: option.data.voteCount + BigInt(1),
						pointsAtDeadline: option.data.pointsAtDeadline + question.user.pointsAtDeadline,
					},
					user: {
						voted: true
					}
				}
			}
			return option
		})

		setQuestion({
			...question,
			options: updatedOptions,
		})
	}


	return (
		<div>
			{isActive && (
				<div className="flex justify-between items-center mb-6">
					<div className="flex items-center gap-4">
						<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
							<DialogTrigger asChild>
								<Button disabled={!canAddOption}>
									<Plus className="mr-2 h-4 w-4" /> Proponer opción
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Proponer una nueva opción</DialogTitle>
									<DialogDescription>
										Ingresa el título y la descripción para tu propuesta.
									</DialogDescription>
								</DialogHeader>
								<AddOptionForm onAdd={handlePropose} />
							</DialogContent>
						</Dialog>
						{!canAddOption && (
							<span className="text-sm text-muted-foreground">
								No contás con los puntos suficientes para proponer una opción
							</span>
						)}
					</div>
				</div>
			)}
			<OptionList
				onVote={handleVote}
			/>
		</div>
	)
}