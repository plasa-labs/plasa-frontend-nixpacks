// External imports
import { Users } from 'lucide-react'

// Internal UI component imports
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { AddressScanLink } from '@/components/common/ScanLink'

// Hooks and utilities
import { useSpace } from '@/contexts/SpaceContext'
import { formatPoints } from '@/lib/utils/formatters'

/**
 * SpaceLeaderboard Component
 * 
 * Displays a leaderboard of the top 10 members in a space based on their point holdings.
 * Shows member addresses and their corresponding point balances.
 * If no members exist, displays a message indicating the space is empty.
 */
export default function SpaceLeaderboard() {
	const { space } = useSpace()
	if (!space) return null

	const { top10Holders, symbol } = space.points.data
	const filteredTop10Holders = top10Holders.filter(holder => holder.balance > 0)

	return (
		<Card className='mb-6'>
			<CardHeader>
				<CardTitle className='flex items-center'>
					<Users className='mr-2' />
					Top Miembros
				</CardTitle>
			</CardHeader>
			<CardContent>
				{filteredTop10Holders.length === 0 ? (
					<div className='text-center text-muted-foreground'>
						Aún no hay miembros en este espacio
					</div>
				) : (
					filteredTop10Holders.map((holder, index) => (
						<div key={index} className='flex justify-between items-center py-2 border-b last:border-b-0'>
							<span className='flex-1 text-left'>{holder.name || 'user'}</span>
							{/* <span className='flex-1 text-center'><AddressScanLink address={holder.user} /></span> */}
							<span className='flex-1 text-right'>
								<Badge variant='secondary'>{formatPoints(holder.balance)} {symbol}</Badge>
							</span>
						</div>
					))
				)}
			</CardContent>
		</Card>
	)
}