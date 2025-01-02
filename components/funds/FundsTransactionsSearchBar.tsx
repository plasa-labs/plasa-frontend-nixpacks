import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from 'lucide-react'

interface SearchBarProps {
	onSearch: (prefix: string) => void
	onReset: () => void
	isSearchActive: boolean
	searchTerm: string
}

export default function SearchBar({ onSearch, onReset, isSearchActive, searchTerm }: SearchBarProps) {
	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

	useEffect(() => {
		if (!isSearchActive) {
			setLocalSearchTerm('')
		} else {
			setLocalSearchTerm(searchTerm)
		}
	}, [searchTerm, isSearchActive])

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (localSearchTerm.trim()) {
			onSearch(localSearchTerm.trim())
		}
	}

	const handleReset = () => {
		setLocalSearchTerm('')
		onReset()
	}

	return (
		<form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
			<div className="relative flex-grow">
				<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
				<Input
					type="text"
					placeholder="Buscar por número de operación..."
					value={localSearchTerm}
					onChange={(e) => setLocalSearchTerm(e.target.value)}
					className="pl-8 pr-10"
				/>
				{isSearchActive && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="absolute right-2 top-1/2 transform -translate-y-1/2"
						onClick={handleReset}
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>
			<Button type="submit" disabled={!localSearchTerm.trim()}>
				Buscar
			</Button>
		</form>
	)
}

