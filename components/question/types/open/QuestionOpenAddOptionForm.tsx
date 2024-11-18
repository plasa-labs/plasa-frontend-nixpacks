"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import TransactionButton from "@/components/common/TransactionButton"
import { useQuestion } from "@/contexts/QuestionContext"
import { contractsAddOption } from "@/lib/onchain/contracts"

interface QuestionOpenAddOptionFormProps {
	onAdd: (title: string, description: string) => void
}

export function QuestionOpenAddOptionForm({ onAdd }: QuestionOpenAddOptionFormProps) {
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