"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import TransactionButton from "@/components/common/TransactionButton"
import { useQuestion } from "@/contexts/QuestionContext"
import { contractsAddOption } from "@/lib/onchain/contracts"

interface QuestionOpenAddOptionFormProps {
	onPropose: () => void
}

export function QuestionOpenAddOptionForm({ onPropose }: QuestionOpenAddOptionFormProps) {
	const [newOptionTitle, setNewOptionTitle] = useState("")
	const [newOptionDescription, setNewOptionDescription] = useState("")

	const { question, refetch: refetchQuestion } = useQuestion()
	if (!question) return null

	const questionAddress = question?.data.contractAddress as `0x${string}`

	const handleAdd = () => {
		refetchQuestion()
		setNewOptionTitle("")
		setNewOptionDescription("")
		onPropose()
	}

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
				onSuccess={handleAdd}
			>
				Proponer opción
			</TransactionButton>
		</div >
	)
}