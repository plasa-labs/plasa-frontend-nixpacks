'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Hospital, Users, Building, Briefcase, BanknoteIcon as Bank, BuildingIcon as GovernmentBuilding } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { FundsData } from '@/lib/types'

interface OrganizationCardProps {
	accountData: FundsData
}

export default function OrganizationCard({ accountData }: OrganizationCardProps) {
	const [showDetails, setShowDetails] = useState(false)

	const IconWrapper = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
		<div className="flex flex-col items-center justify-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
			<div className="mb-2 p-2 bg-white dark:bg-gray-700 rounded-full">
				<Icon className="h-6 w-6 text-primary" />
			</div>
			<span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</span>
			<span className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-center break-words w-full">{value}</span>
		</div>
	)

	return (
		<Card className="col-span-1 md:col-span-2 lg:col-span-4">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-2xl font-bold">
					<div className="flex items-center">
						<div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0">
							<Hospital className="h-8 w-8 text-primary" />
						</div>
						<span className="text-xl md:text-2xl break-words">{accountData.account.name}</span>
					</div>
				</CardTitle>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setShowDetails(!showDetails)}
					className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
				>
					{showDetails ? (
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m18 15-6-6-6 6" /></svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m6 9 6 6 6-6" /></svg>
					)}
				</Button>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
						<Users className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
						<span className="break-words">Organización No Gubernamental</span>
					</div>
					{showDetails && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
							<IconWrapper
								icon={Building}
								label="Titular"
								value={accountData.account.owner || ''}
							/>
							<IconWrapper
								icon={GovernmentBuilding}
								label="CUIT"
								value={accountData.account.cuit || ''}
							/>
							<IconWrapper
								icon={Bank}
								label="CVU"
								value={accountData.account.cvu || ''}
							/>
							<IconWrapper
								icon={Briefcase}
								label="ID de Mercado Pago"
								value={accountData.account.id || ''}
							/>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	)
}

