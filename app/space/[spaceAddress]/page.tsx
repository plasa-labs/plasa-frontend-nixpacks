'use client'

// External dependencies
import { useParams } from 'next/navigation'

// Internal components
import Space from '@/components/space/Space'

/**
 * Type definition for URL parameters expected in the Space page route
 */
interface SpacePageParams {
	[key: string]: string
	spaceAddress: string
}

export default function SpacePage() {
	const { spaceAddress } = useParams<SpacePageParams>()
	return <Space spaceAddress={spaceAddress} />
}
