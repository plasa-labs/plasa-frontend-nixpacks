'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import FundsTransactionRow from './FundsTransactionRow'
import { Transaction } from '@/lib/types'

interface FundsTransactionsTableProps {
	transactions: Transaction[] | null
	mercadoPagoId: string
	isLoading: boolean
	isSearchActive: boolean
}

export default function FundsTransactionsTable({ transactions, mercadoPagoId, isLoading, isSearchActive }: FundsTransactionsTableProps) {
	const renderSkeletonRow = (index: number) => (
		<TableRow key={`skeleton-${index}`} className="h-16">
			<TableCell className="font-medium w-[80px] md:w-[120px]">
				<Skeleton className="h-5 w-full" />
			</TableCell>
			<TableCell className="hidden sm:table-cell w-[100px] md:w-[140px]">
				<Skeleton className="h-6 w-24" />
			</TableCell>
			<TableCell className="w-[100px] md:w-[140px]">
				<Skeleton className="h-5 w-full" />
			</TableCell>
			<TableCell className="hidden md:table-cell w-[180px]">
				<Skeleton className="h-5 w-full" />
			</TableCell>
			<TableCell className="w-[40px]">
				<Skeleton className="h-8 w-8 rounded-full" />
			</TableCell>
		</TableRow>
	)

	if (isLoading) {
		return (
			<div className="overflow-x-auto">
				<Table className="min-w-[300px]">
					<TableHeader>
						<TableRow>
							<TableHead className="w-[80px] md:w-[120px]">Número de operación</TableHead>
							<TableHead className="hidden sm:table-cell w-[100px] md:w-[140px]">Estado</TableHead>
							<TableHead className="w-[100px] md:w-[140px]">Monto</TableHead>
							<TableHead className="hidden md:table-cell w-[180px]">Fecha</TableHead>
							<TableHead className="w-[40px]"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array(20).fill(null).map((_, i) => renderSkeletonRow(i))}
					</TableBody>
				</Table>
			</div>
		)
	}

	if (!transactions || transactions.length === 0) {
		return (
			<div className="text-center py-8">
				<p>{isSearchActive ? "No se encontraron resultados para esta búsqueda." : "No hay movimientos disponibles."}</p>
			</div>
		)
	}

	return (
		<div className="overflow-x-auto">
			<Table className="min-w-[300px]">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[80px] md:w-[120px]">Número de operación</TableHead>
						<TableHead className="hidden sm:table-cell w-[100px] md:w-[140px]">Estado</TableHead>
						<TableHead className="w-[100px] md:w-[140px]">Monto</TableHead>
						<TableHead className="hidden md:table-cell w-[180px]">Fecha</TableHead>
						<TableHead className="w-[40px]"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactions.map((tx) => (
						<FundsTransactionRow
							key={tx.id}
							tx={tx}
							mercadoPagoId={mercadoPagoId}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

