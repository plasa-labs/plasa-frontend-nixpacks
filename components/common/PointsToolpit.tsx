import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'

interface PointsToolpitProps {
	className?: string
}

export default function PointsToolpit(props: PointsToolpitProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<InfoIcon className={`h-4 w-4 text-muted-foreground ${props.className}`} />
				</TooltipTrigger>
				<TooltipContent>
					<p>Al votar, contarán los puntos que tendrás al momento de finalizar la votación.</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
