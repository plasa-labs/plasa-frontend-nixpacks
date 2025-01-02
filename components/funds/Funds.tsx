import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FundsOrganizationCard from './FundsOrganizationCard'
import FundsFinancialSummary from './FundsFinancialSummary'
import FundsTransactionsClientSearch from './FundsTransactionsClientSearch'
import { FundsData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface FundsProps {
	accountData: FundsData
	accountKey: string
	searchTerm?: string
	children: React.ReactNode
}

export default function Funds({
	accountData,
	accountKey,
	searchTerm,
	children
}: FundsProps) {
	return (
		<main className="main-container">
			<Link href='/' passHref prefetch={true}>
				<Button variant='outline' className='mb-6'>
					<ArrowLeft className='mr-2 h-4 w-4' />
					{/* Volver a {space?.data.name ? space.data.name : 'Espacio'} */}
					Volver a Inicio
				</Button>
			</Link>

			<div className="grid grid-cols-1 gap-6 mb-8">
				<FundsOrganizationCard accountData={accountData} />
				<FundsFinancialSummary accountData={accountData} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-xl md:text-2xl text-gray-800 dark:text-gray-200">Movimientos</CardTitle>
				</CardHeader>
				<CardContent>
					<FundsTransactionsClientSearch
						initialSearchTerm={searchTerm || ''}
						accountKey={accountKey}
					/>
					{children}
				</CardContent>
			</Card>
		</main>
	)
}

