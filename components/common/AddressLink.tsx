import { ExternalLink } from "lucide-react"
import { abbreviateAddress, scanLink } from '@/lib/utils/formatters'

interface AddressLinkProps {
	address: string
	className?: string
}

export function AddressLink({ address, className = "" }: AddressLinkProps) {
	return (
		<a
			href={scanLink(address)}
			target="_blank"
			rel="noopener noreferrer"
			className={`text-primary hover:underline inline-flex items-center ${className}`}
		>
			{abbreviateAddress(address)}
			<ExternalLink className="h-3 w-3 ml-1" />
		</a>
	)
}
