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

/**
 * SpacePage Component
 * 
 * A client-side rendered page component that displays a specific space based on the address
 * provided in the URL parameters. This component acts as a wrapper around the Space component,
 * handling the routing logic and parameter extraction.
 * 
 * @route /space/[spaceAddress]
 * @example
 * URL: /space/0x123...
 * 
 * @returns {JSX.Element} Rendered Space component with the extracted space address
 */
export default function SpacePage(): JSX.Element {
	const { spaceAddress } = useParams<SpacePageParams>()
	return <Space spaceAddress={spaceAddress} />
}
