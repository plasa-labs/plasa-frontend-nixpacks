'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

interface ClientPaginationProps {
	paginationInfo: { lastDocId: string; hasMore: boolean }
	currentPage: number
	accountKey: string
	pageHistory: { page: number; lastTransactionId: string }[]
}

export default function ClientPagination({
	paginationInfo,
	currentPage,
	accountKey,
	pageHistory
}: ClientPaginationProps) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		setIsLoading(false)
	}, [currentPage, paginationInfo])

	const handleNextPage = () => {
		setIsLoading(true)
		const nextPage = currentPage + 1
		router.push(`/funds/${accountKey}?page=${nextPage}&lastTransactionId=${paginationInfo.lastDocId}`)
	}

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setIsLoading(true)
			const prevPage = currentPage - 1
			const prevLastTransactionId = pageHistory[prevPage - 1]?.lastTransactionId || ''
			router.push(`/funds/${accountKey}?page=${prevPage}&lastTransactionId=${prevLastTransactionId}`)
		}
	}

	return (
		<div className="flex justify-between w-full items-center mt-4">
			<Button
				onClick={handlePreviousPage}
				disabled={currentPage === 1 || isLoading}
			>
				Anterior
			</Button>
			<span>{isLoading ? 'Cargando...' : `Página ${currentPage}`}</span>
			<Button
				onClick={handleNextPage}
				disabled={!paginationInfo.hasMore || isLoading}
			>
				Siguiente
			</Button>
		</div>
	)
}

