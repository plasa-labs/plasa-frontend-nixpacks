"use client"

import { useState } from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { usePrivy } from "@privy-io/react-auth"
import { useQuestion } from "@/contexts/QuestionContext"
import { useSpace } from "@/contexts/SpaceContext"
import { usePlasa } from "@/contexts/PlasaContext"
import { OptionView } from "@/lib/onchain/types/interfaces"

import { QuestionOpenAddOptionForm } from "./QuestionOpenAddOptionForm"
import { QuestionOpenOptionsList } from "./QuestionOpenOptionsList"

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
								<QuestionOpenAddOptionForm onAdd={handlePropose} />
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
			<QuestionOpenOptionsList
				onVote={handleVote}
			/>
		</div>
	)
}