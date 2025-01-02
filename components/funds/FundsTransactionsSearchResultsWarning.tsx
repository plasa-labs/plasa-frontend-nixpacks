import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

interface SearchResultsInfoProps {
	searchTerm: string
}

export default function SearchResultsInfo({ searchTerm }: SearchResultsInfoProps) {
	return (
		<Alert variant="warning" className="mb-4 bg-yellow-50 border-yellow-200 text-yellow-800">
			<AlertCircle className="h-4 w-4" />
			<AlertDescription>
				Se encontraron más de 20 resultados para &quot;{searchTerm}&quot;. Solo se muestran los primeros 20.
				Para ver más resultados, intentá realizar una búsqueda más específica.
			</AlertDescription>
		</Alert>
	)
}

