'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { SpacePreview } from '@/lib/onchain/types/spaces'

export const SpacesSpaceCard = ({ space }: { space: SpacePreview }) => (
	<Card className="mb-4">
		<div className="flex items-center p-4">
			<div className="w-16 h-16 mr-4 overflow-hidden rounded-lg relative flex-shrink-0">
				<Image
					src={space.data.imageUrl}
					alt={space.data.name}
					width={64}
					height={64}
					className="object-cover"
				/>
			</div>
			<div className="flex-grow">
				<CardTitle className="mb-2">{space.data.name}</CardTitle>
				<p className="text-sm text-gray-600">{space.data.description}</p>
			</div>
			<Link href={`/space/${space.data.contractAddress}`} passHref>
				<Button className="ml-4">Entrar</Button>
			</Link>
		</div>
	</Card>
)
