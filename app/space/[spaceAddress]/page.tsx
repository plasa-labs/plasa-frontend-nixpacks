'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, ChevronRight, Users, Eye, ArrowLeft, Calendar, Hash } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { SpaceView } from '@/app/ts-interfaces/types/spaces'
import { QuestionType, QuestionView } from '@/app/ts-interfaces/types/questions'

// Mock data (moved outside the component for clarity)
const mockSpace: SpaceView = {
	data: {
		contractAddress: "0xaaaa1111bbbb2222cccc3333dddd4444eeee5555",
		name: "Crypto Governance",
		description: "A space for discussing and voting on crypto governance proposals",
		imageUrl: "https://raw.githubusercontent.com/base-org/brand-kit/refs/heads/main/logo/in-product/Base_Network_Logo.png",
		creationTimestamp: 1620000000000,
	},
	user: {
		roles: {
			superAdmin: false,
			admin: true,
			mod: true,
		},
		permissions: {
			UpdateSpaceInfo: true,
			UpdateSpacePoints: true,
			UpdateQuestionInfo: true,
			UpdateQuestionDeadline: true,
			UpdateQuestionPoints: true,
			CreateFixedQuestion: true,
			CreateOpenQuestion: true,
			VetoFixedQuestion: false,
			VetoOpenQuestion: false,
			VetoOpenQuestionOption: false,
			LiftVetoFixedQuestion: false,
			LiftVetoOpenQuestion: false,
			LiftVetoOpenQuestionOption: false,
			AddOpenQuestionOption: false,
		},
	},
	points: {
		data: {
			contractAddress: "0xbbbb2222cccc3333dddd4444eeee5555ffff6666",
			name: "Governance Points",
			symbol: "GP",
		},
		user: {
			currentBalance: 1000,
		},
	},
	questions: [
		{
			data: {
				contractAddress: "0x1111aaaabbbbccccddddeeeeffffgggg2222hhhh",
				questionType: QuestionType.Fixed,
				title: "Should we implement EIP-1559?",
				description: "Proposal to implement Ethereum Improvement Proposal 1559",
				creator: "0xcccc3333dddd4444eeee5555ffff6666gggg7777",
				kickoff: Date.now(),
				deadline: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days from now
				isActive: true,
				voteCount: 1500,
			},
			user: {
				canVote: true,
				pointsAtDeadline: 950,
			},
		},
		{
			data: {
				contractAddress: "0x4444iiiijjjjkkkkllllmmmmnnnnoooo5555pppp",
				questionType: QuestionType.Open,
				title: "What should be our next focus area?",
				description: "Open discussion on the next priority for our governance",
				creator: "0xdddd4444eeee5555ffff6666gggg7777hhhh8888",
				kickoff: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
				deadline: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
				isActive: false,
				voteCount: 750,
			},
			user: {
				canVote: false,
				pointsAtDeadline: 1000,
			},
		},
	]
}

const mockLeaderboard = [
	{ name: "alice", points: 8900 },
	{ name: "bob", points: 7500 },
	{ name: "charlie", points: 6200 },
	{ name: "david", points: 5800 },
	{ name: "eve", points: 4900 },
]

const BackToSpacesButton = () => (
	<Button variant="outline" size="sm" className="mb-4">
		<ArrowLeft className="mr-2 h-4 w-4" /> Volver a espacios
	</Button>
)

const SpaceHeader = ({ name, description, points, symbol, imageUrl }: { name: string; description: string; points: number; symbol: string; imageUrl: string }) => (
	<Card className="mb-6">
		<CardHeader>
			<div className="flex items-start">
				<div className="mr-4 flex-shrink-0">
					<Image src={imageUrl} alt={`${name} logo`} width={64} height={64} className="rounded-full" />
				</div>
				<div className="flex-grow">
					<CardTitle className="text-3xl mb-2">{name}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
				<Badge variant="secondary" className="text-lg px-3 py-1 ml-4">
					{points} {symbol}
				</Badge>
			</div>
		</CardHeader>
	</Card>
)

const SpaceHeaderSkeleton = () => (
	<Card className="mb-6">
		<CardHeader>
			<div className="flex items-start">
				<Skeleton className="w-16 h-16 rounded-full mr-4" />
				<div className="flex-grow">
					<Skeleton className="h-8 w-64 mb-2" />
					<Skeleton className="h-4 w-96" />
				</div>
				<Skeleton className="h-6 w-24 ml-4" />
			</div>
		</CardHeader>
	</Card>
)

const QuestionsList = ({ questions, canCreateQuestion }: { questions: any[]; canCreateQuestion: boolean }) => (
	<Card className="mb-6">
		<CardHeader>
			<div className="flex justify-between items-center">
				<CardTitle>Votaciones</CardTitle>
				<Button size="sm" disabled={!canCreateQuestion}>
					<PlusCircle className="mr-2 h-4 w-4" /> Nueva votación
				</Button>
			</div>
		</CardHeader>
		<CardContent>
			{questions.map((question, index) => (
				<QuestionCard key={index} question={question} />
			))}
		</CardContent>
	</Card>
)

const QuestionsListSkeleton = () => (
	<Card className="mb-6">
		<CardHeader>
			<div className="flex justify-between items-center">
				<Skeleton className="h-6 w-24" />
				<Skeleton className="h-9 w-36" />
			</div>
		</CardHeader>
		<CardContent>
			{[1, 2].map((_, index) => (
				<div key={index} className="mb-4 p-4 border rounded-lg">
					<div className="flex justify-between items-start mb-2">
						<div>
							<Skeleton className="h-5 w-64 mb-2" />
							<Skeleton className="h-4 w-40" />
						</div>
						<div className="flex flex-col items-end">
							<Skeleton className="h-6 w-16 mb-2" />
							<Skeleton className="h-8 w-20" />
						</div>
					</div>
				</div>
			))}
		</CardContent>
	</Card>
)

const QuestionCard = ({ question }: { question: QuestionView }) => {
	const isActive = question.data.isActive
	const canVote = question.user.canVote
	const timeRemaining = new Date(question.data.deadline).getTime() - Date.now()
	const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

	return (
		<Card className="mb-4">
			<CardHeader>
				<div className="flex justify-between items-start">
					<CardTitle className="text-lg">{question.data.title}</CardTitle>
					<Badge variant={isActive ? "default" : "secondary"}>
						{isActive ? 'Activa' : 'Cerrada'}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex justify-between items-center text-sm text-gray-500 mb-4">
					<span>
						{isActive ? `Quedan ${daysRemaining} días` : `Terminó hace ${Math.abs(daysRemaining)} días`}
					</span>
					<span>{question.data.voteCount} votos</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-sm font-medium">
						Tus puntos: {question.user.pointsAtDeadline}
					</span>
					{canVote && isActive ? (
						<Button variant="default" size="sm">
							Votar
						</Button>
					) : (
						<Button variant="outline" size="sm">
							<Eye className="mr-2 h-4 w-4" /> Ver
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	)
}

const Leaderboard = ({ members }: { members: { name: string; points: number }[] }) => (
	<Card className="mb-6">
		<CardHeader>
			<CardTitle className="flex items-center">
				<Users className="mr-2" />
				Top Miembros (Mock)
			</CardTitle>
		</CardHeader>
		<CardContent>
			{members.map((member, index) => (
				<div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
					<span>{member.name}</span>
					<Badge variant="secondary">{member.points} puntos</Badge>
				</div>
			))}
			<Button variant="outline" className="w-full mt-4">
				Ver todos <ChevronRight className="ml-2 h-4 w-4" />
			</Button>
		</CardContent>
	</Card>
)

const LeaderboardSkeleton = () => (
	<Card className="mb-6">
		<CardHeader>
			<Skeleton className="h-6 w-32" />
		</CardHeader>
		<CardContent>
			{[1, 2, 3, 4, 5].map((_, index) => (
				<div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-6 w-20" />
				</div>
			))}
			<Skeleton className="h-9 w-full mt-4" />
		</CardContent>
	</Card>
)

const SpaceInfo = ({ contractAddress, creationDate }: { contractAddress: string; creationDate: number }) => (
	<Card>
		<CardHeader>
			<CardTitle>Información del Espacio</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="flex items-center mb-2">
				<Hash className="mr-2 h-4 w-4" />
				<span className="text-sm">Dirección del contrato: {contractAddress}</span>
			</div>
			<div className="flex items-center">
				<Calendar className="mr-2 h-4 w-4" />
				<span className="text-sm">Fecha de creación: {new Date(creationDate).toLocaleDateString()}</span>
			</div>
		</CardContent>
	</Card>
)

const SpaceInfoSkeleton = () => (
	<Card>
		<CardHeader>
			<Skeleton className="h-6 w-48" />
		</CardHeader>
		<CardContent>
			<div className="flex items-center mb-2">
				<Skeleton className="h-4 w-4 mr-2" />
				<Skeleton className="h-4 w-64" />
			</div>
			<div className="flex items-center">
				<Skeleton className="h-4 w-4 mr-2" />
				<Skeleton className="h-4 w-48" />
			</div>
		</CardContent>
	</Card>
)

export default function Component() {
	const { spaceAddress } = useParams()

	const [space, setSpace] = useState<SpaceView | null>(null)
	const [leaderboardData, setLeaderboardData] = useState<any>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			// Simulate API call delay
			await new Promise(resolve => setTimeout(resolve, 2000))
			setSpace(mockSpace)
			setLeaderboardData(mockLeaderboard)
			setLoading(false)
		}

		fetchData()
	}, [])

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto bg-background text-foreground p-6">
				<BackToSpacesButton />
				<SpaceHeaderSkeleton />
				<QuestionsListSkeleton />
				<LeaderboardSkeleton />
				<SpaceInfoSkeleton />
			</div>
		)
	}

	return (
		<div className="max-w-4xl mx-auto bg-background text-foreground p-6">
			<BackToSpacesButton />
			<SpaceHeader
				name={space.data.name}
				description={space.data.description}
				points={space.points.user.currentBalance}
				symbol={space.points.data.symbol}
				imageUrl={space.data.imageUrl}
			/>
			<QuestionsList
				questions={space.questions}
				canCreateQuestion={space.user.permissions.CreateFixedQuestion || space.user.permissions.CreateOpenQuestion}
			/>
			<Leaderboard members={leaderboardData} />
			<SpaceInfo
				contractAddress={space.data.contractAddress}
				creationDate={space.data.creationTimestamp}
			/>
		</div>
	)
}
