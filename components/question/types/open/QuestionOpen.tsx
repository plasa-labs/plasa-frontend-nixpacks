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
import { useSpace } from "@/contexts/SpaceContext"
import { usePlasa } from "@/contexts/PlasaContext"
import { useQuestion } from "@/contexts/QuestionContext"
import { QuestionOpenAddOptionForm } from "./QuestionOpenAddOptionForm"
import { QuestionOpenOptionsList } from "./QuestionOpenOptionsList"

export default function QuestionOpen() {
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const { space } = useSpace()
	const { question } = useQuestion()
	const { plasa } = usePlasa()

	if (!question) return null
	if (!space) return null
	if (!plasa) return null

	const isActive = question.data.isActive
	const canAddOption = space.user.permissions.AddOpenQuestionOption

	const handlePropose = () => {
		setIsDialogOpen(false)
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
								<QuestionOpenAddOptionForm onPropose={handlePropose} />
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
			<QuestionOpenOptionsList />
		</div>
	)
}