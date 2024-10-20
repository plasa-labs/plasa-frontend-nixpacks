"use client"

import { useEffect, useState } from "react"
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { AlertTriangle, ArrowLeft, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusAction, TransactionStatusLabel } from '@coinbase/onchainkit/transaction'
import { useAccount, useReadContract } from 'wagmi'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert } from "@/components/ui/alert"

import { contractsGetQuestion, contractsVote } from '@/lib/onchain/contracts'
import { OptionView } from '@/lib/onchain/types/options'
import { QuestionType, QuestionView } from '@/lib/onchain/types/questions'
import { formatPoints } from '@/lib/format'


const QuestionHeader = ({ title, active, timeLeft }: { title: string; active: boolean; timeLeft: string }) => (
	<div className="mb-6">
		<div className="flex items-center justify-between mb-2">
			<h1 className="text-3xl font-bold">{title}</h1>
			<Badge variant={active ? "default" : "secondary"}>{active ? "Activa" : "Finalizada"}</Badge>
		</div>
		{active ? (
			<div className="flex items-center text-sm text-muted-foreground">
				<Clock className="mr-2 h-4 w-4" />
				<span>{timeLeft} para votar</span>
			</div>
		) : (
			<div className="flex items-center text-sm text-muted-foreground">
				<AlertTriangle className="mr-2 h-4 w-4" />
				<span>La votación ha finalizado</span>
			</div>
		)}
	</div>
)

const QuestionDetails = ({ description, totalPoints, canVote, userPointsAtDeadline, isConnected }: { description: string; totalPoints: number; canVote: boolean; userPointsAtDeadline: number; isConnected: boolean }) => (
	<Card className="mb-6">
		<CardContent className="pt-6">
			<p className="mb-4 text-muted-foreground">{description}</p>
			{!isConnected ? (
				<Alert variant="destructive" className="mb-4">
					<AlertCircle className="h-4 w-4" />
					<p className="ml-2">
						Debes estar conectado para votar.
					</p>
				</Alert>
			) : (userPointsAtDeadline == 0 ? (
				<Alert variant="destructive" className="mb-4">
					<AlertCircle className="h-4 w-4" />
					<p className="ml-2">
						No tienes puntos para votar. Visita tu <a href="/profile" className="font-medium underline" target="_blank">perfil</a> para obtener sellos y ganar puntos.
					</p>
				</Alert>
			) : (
				<div className="flex justify-between items-center bg-muted p-3 rounded-lg">
					<p className="text-sm font-medium">Tus puntos: <span className="text-primary">{formatPoints(totalPoints)}</span></p>
					{canVote ? (
						<Badge variant="outline" className="bg-primary text-primary-foreground">Puedes votar</Badge>
					) : (
						<Badge variant="outline" className="bg-secondary text-secondary-foreground">Ya has votado</Badge>
					)}
				</div>
			))}
		</CardContent>
	</Card>
)

const VotingOptions = ({ options, onVote, canVote, active, questionAddress, isConnected, userPointsAtDeadline }: { options: OptionView[]; onVote: (index: number) => void; canVote: boolean; active: boolean; questionAddress: string; isConnected: boolean; userPointsAtDeadline: number }) => {
	return (
		<div className="space-y-4 mb-6">
			{options.slice(1).map((option, index) => (
				<Card key={index + 1} className={option.user.voted ? "border-primary" : ""}>
					<CardContent className="pt-6">
						<div className="flex justify-between items-start mb-4">
							<div>
								<h3 className="text-lg font-semibold mb-2">{option.data.title}</h3>
								<p className="text-sm text-muted-foreground">{option.data.description}</p>
							</div>
							{option.user.voted && (
								<Badge variant="secondary" className="ml-2">
									<CheckCircle2 className="mr-1 h-4 w-4" />
									Tu voto
								</Badge>
							)}
						</div>
						{canVote && active && isConnected && userPointsAtDeadline > 0 && (
							<Transaction
								chainId={84532} // Base Sepolia chain ID
								contracts={contractsVote(questionAddress as `0x${string}`, index + 1)}
								onSuccess={(response) => {
									console.log('Vote transaction successful:', response)
									onVote(index + 1)
								}}
								onError={(error) => {
									console.error('Vote transaction failed:', error)
								}}
							>
								<TransactionButton text="Votar por esta opción">
								</TransactionButton>
								<TransactionStatus>
									<TransactionStatusLabel />
									<TransactionStatusAction />
								</TransactionStatus>
							</Transaction>
						)}
						{/* {!canVote && (
							<Badge variant="outline" className="bg-secondary text-secondary-foreground">Ya has votado</Badge>
						)} */}
					</CardContent>
				</Card>
			))}
		</div>
	)
}

const VotingProgress = ({ options }: { options: OptionView[] }) => {
	const totalPoints = options.slice(1).reduce((sum, option) => sum + Number(option.data.pointsAtDeadline), 0)
	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Progreso de la Votación</CardTitle>
			</CardHeader>
			<CardContent>
				{options.slice(1).map((option, index) => {
					const percentage = totalPoints === 0 ? 0 : (Number(option.data.pointsAtDeadline) / totalPoints) * 100
					return (
						<div key={index + 1} className="mb-4 last:mb-0">
							<div className="flex justify-between mb-1">
								<span className="text-sm font-medium">{option.data.title}</span>
								<span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
							</div>
							<div className="relative pt-1">
								<div className="flex mb-2 items-center justify-between">
									<div>
										<span className="text-lg font-semibold inline-block text-primary">
											{Math.floor(Number(option.data.pointsAtDeadline) / 1e15).toLocaleString()} puntos
										</span>
									</div>
									<div className="text-right">
										<span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary text-primary-foreground">
											{option.data.voteCount.toString()} votos
										</span>
									</div>
								</div>
								<Progress value={percentage} className="h-2" />
							</div>
						</div>
					)
				})}
			</CardContent>
		</Card>
	)
}

const InformationSection = ({ spaceData, question }: { spaceData: { name: string; contractAddress: string }; question: QuestionView }) => {
	const formatDate = (timestamp: number) => {
		return new Date(Number(timestamp) * 1000).toLocaleString('es-AR', {
			timeZone: 'America/Argentina/Buenos_Aires',
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		})
	}

	// Function to get the question type string
	const getQuestionTypeString = (questionType: QuestionType): string => {
		switch (questionType) {
			case QuestionType.Open:
				return "Abierta"
			case QuestionType.Fixed:
				return "Cerrado"
			default:
				return "Cerrado"
		}
	}

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Información de la Pregunta</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
					<div>
						<p className="font-semibold">Espacio</p>
						<p className="text-muted-foreground">{spaceData.name}</p>
					</div>
					<div>
						<p className="font-semibold">Contrato del Espacio</p>
						<p className="text-muted-foreground truncate">{spaceData.contractAddress}</p>
					</div>
					<div>
						<p className="font-semibold">Contrato del Tema</p>
						<p className="text-muted-foreground truncate">{question.data.contractAddress}</p>
					</div>
					<div>
						<p className="font-semibold">Tipo de Tema</p>
						<p className="text-muted-foreground">{getQuestionTypeString(question.data.questionType)}</p>
					</div>
					<div>
						<p className="font-semibold">Inicio</p>
						<p className="text-muted-foreground">{formatDate(question.data.kickoff)}</p>
					</div>
					<div>
						<p className="font-semibold">Fin</p>
						<p className="text-muted-foreground">{formatDate(question.data.deadline)}</p>
					</div>
					<div>
						<p className="font-semibold">Total de Votos</p>
						<p className="text-muted-foreground">{question.data.voteCount.toString()}</p>
					</div>
					<div>
						<p className="font-semibold">Creador</p>
						<p className="text-muted-foreground truncate">{question.data.creator}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

const LoadingComponent = () => (
	<div className="space-y-4">
		<Skeleton className="h-12 w-3/4" />
		<Skeleton className="h-32 w-full" />
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div className="md:col-span-2 space-y-4">
				<Skeleton className="h-48 w-full" />
				<Skeleton className="h-48 w-full" />
				<Skeleton className="h-48 w-full" />
			</div>
			<Skeleton className="h-96 w-full" />
		</div>
	</div>
)

export default function QuestionPage() {
	const { spaceAddress, questionAddress } = useParams()
	const { address: userAddress, isConnected } = useAccount()

	const [timeLeft, setTimeLeft] = useState<string>("")

	const contract = contractsGetQuestion(questionAddress as `0x${string}`, userAddress as `0x${string}`)

	const { data: questionData, isLoading, isError } = useReadContract(contract)

	useEffect(() => {
		if (questionData) {
			const question = questionData as unknown as QuestionView
			console.log(question)
			if (question.data.isActive) {
				const updateTimeLeft = () => {
					const now = Date.now()
					const remaining = Number(question.data.deadline) * 1000 - now
					if (remaining <= 0) {
						setTimeLeft("Votación finalizada")
					} else {
						const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
						const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
						const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
						const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
						setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
					}
				}

				// Update immediately and then every second
				updateTimeLeft()
				const timer = setInterval(updateTimeLeft, 1000)

				return () => clearInterval(timer)
			} else {
				setTimeLeft("Votación finalizada")
			}
		}
	}, [questionData])

	const handleVote = async (optionIndex: number) => {
		if (questionData) {
			const updatedQuestionData = { ...questionData } as unknown as QuestionView
			updatedQuestionData.options[optionIndex].data.voteCount = Number(updatedQuestionData.options[optionIndex].data.voteCount) + 1
			updatedQuestionData.options[optionIndex].user.voted = true
			updatedQuestionData.user.canVote = false
			updatedQuestionData.data.voteCount = Number(updatedQuestionData.data.voteCount) + 1
			updatedQuestionData.options[optionIndex].data.pointsAtDeadline = Number(updatedQuestionData.options[optionIndex].data.pointsAtDeadline) + Number(updatedQuestionData.user.pointsAtDeadline)
		}
	}

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<LoadingComponent />
			</div>
		)
	}

	if (isError || !questionData) {
		return <div>Error al cargar los datos</div>
	}

	const question = questionData as unknown as QuestionView

	return (
		<div className="container mx-auto px-4 py-8">
			<Link href={`/space/${spaceAddress}`} passHref>
				<Button variant="outline" className="mb-6">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Volver a Temas
				</Button>
			</Link>
			<QuestionHeader
				title={question.data.title}
				active={question.data.isActive}
				timeLeft={timeLeft}
			/>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<QuestionDetails
						description={question.data.description}
						totalPoints={question.user.pointsAtDeadline}
						canVote={question.user.canVote}
						userPointsAtDeadline={question.user.pointsAtDeadline}
						isConnected={isConnected}
					/>
					<VotingOptions
						options={question.options}
						onVote={handleVote}
						canVote={question.user.canVote}
						active={question.data.isActive}
						questionAddress={questionAddress as string}
						isConnected={isConnected}
						userPointsAtDeadline={question.user.pointsAtDeadline}
					/>
					<VotingProgress options={question.options} />
				</div>
				<div className="space-y-6">
					<Card>
						<CardContent className="pt-6">
							<h2 className="text-xl font-semibold mb-2">Total de Votos</h2>
							<p className="text-3xl font-bold">{question.data.voteCount.toString()}</p>
						</CardContent>
					</Card>
					<InformationSection spaceData={{
						name: "Space Name", // You might want to fetch this from the parent component
						contractAddress: spaceAddress as string
					}} question={question} />
				</div>
			</div>
		</div>
	)
}
