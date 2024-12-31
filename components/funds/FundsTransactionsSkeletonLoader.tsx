import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export default function FundsTransactionsSkeletonLoader() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]"><Skeleton className="h-4 w-full" /></TableHead>
					<TableHead><Skeleton className="h-4 w-full" /></TableHead>
					<TableHead><Skeleton className="h-4 w-full" /></TableHead>
					<TableHead className="text-right"><Skeleton className="h-4 w-full" /></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{[...Array(20)].map((_, index) => (
					<TableRow key={index}>
						<TableCell className="font-medium"><Skeleton className="h-4 w-full" /></TableCell>
						<TableCell><Skeleton className="h-4 w-full" /></TableCell>
						<TableCell><Skeleton className="h-4 w-full" /></TableCell>
						<TableCell className="text-right"><Skeleton className="h-4 w-full" /></TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

