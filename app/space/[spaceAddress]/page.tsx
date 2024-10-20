'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import { useAccount, useReadContract } from 'wagmi'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

import { PlusCircle, ChevronRight, Users, Eye, ArrowLeft, Calendar, Hash } from 'lucide-react'

import { SpaceView } from '@/lib/onchain/types/spaces'
import { QuestionPreview } from '@/lib/onchain/types/questions'
import { contractsGetSpace } from '@/lib/onchain/contracts'

// Mock data for leaderboard (kept as requested)
const mockLeaderboard = [
	{ name: "alice", points: 8900 },
	{ name: "bob", points: 7500 },
	{ name: "charlie", points: 6200 },
	{ name: "david", points: 5800 },
	{ name: "eva", points: 4900 },
]

const BackToSpacesButton = () => (
	<Link href="/" passHref>
		<Button variant="outline" className="mb-6">
			<ArrowLeft className="mr-2 h-4 w-4" />
			Volver a Espacios
		</Button>
	</Link>
)

const SpaceHeader = ({ name, description, points, symbol, imageUrl }: { name: string; description: string; points: bigint; symbol: string; imageUrl: string }) => (
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
					{formatPoints(points)} {symbol}
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

const QuestionsList = ({ questions, canCreateQuestion, spaceAddress }: { questions: QuestionPreview[]; canCreateQuestion: boolean; spaceAddress: string }) => (
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
				<QuestionCard key={index} question={question} spaceAddress={spaceAddress} />
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

const QuestionCard = ({ question, spaceAddress }: { question: QuestionPreview; spaceAddress: string }) => {
	const router = useRouter()
	const isActive = question.data.isActive
	const canVote = question.user.canVote
	const deadlineTimestamp = Number(question.data.deadline)
	const timeRemaining = new Date(deadlineTimestamp * 1000).getTime() - Date.now()
	const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

	const handleQuestionClick = () => {
		router.push(`/space/${spaceAddress}/question/${question.data.contractAddress}`)
	}

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
					<span>{BigInt(question.data.voteCount).toString()} votos</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-sm font-medium">
						Tus puntos: {formatPoints(BigInt(question.user.pointsAtDeadline))}
					</span>
					{canVote && isActive ? (
						<Button variant="default" size="sm" onClick={handleQuestionClick}>
							Votar
						</Button>
					) : (
						<Button variant="outline" size="sm" onClick={handleQuestionClick}>
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

const SpaceInfo = ({ contractAddress, creationDate }: { contractAddress: string; creationDate: bigint }) => (
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
				<span className="text-sm">Fecha de creación: {new Date(Number(creationDate) * 1000).toLocaleDateString()}</span>
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

function formatPoints(points: bigint): string {
	return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export default function Component() {
	const { spaceAddress } = useParams()
	const { address: userAddress } = useAccount()

	const contract = contractsGetSpace(spaceAddress as `0x${string}`, userAddress as `0x${string}`)

	const { data: spaceData, isLoading, isError } = useReadContract(contract)

	// New useEffect to log spaceData
	useEffect(() => {
		if (spaceData) {
			console.log('Space data:')
			console.log(spaceData)
		}
	}, [spaceData])

	if (isLoading) {
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

	if (isError || !spaceData) {
		return <div>Error loading space data</div>
	}

	const space = spaceData as unknown as SpaceView

	return (
		<div className="max-w-4xl mx-auto bg-background text-foreground p-6">
			<BackToSpacesButton />
			<SpaceHeader
				name={space.data.name}
				description={space.data.description}
				points={BigInt(space.points.user.currentBalance)}
				symbol={space.points.data.symbol}
				imageUrl={space.data.imageUrl}
			/>
			<QuestionsList
				questions={space.questions}
				canCreateQuestion={space.user.permissions.CreateFixedQuestion || space.user.permissions.CreateOpenQuestion}
				spaceAddress={spaceAddress as string}
			/>
			<Leaderboard members={mockLeaderboard} />
			<SpaceInfo
				contractAddress={space.data.contractAddress}
				creationDate={BigInt(space.data.creationTimestamp)}
			/>
		</div>
	)
}
