import { Badge } from '@/components/ui/badge'

interface BadgeProps {
	children: React.ReactNode,
	className?: string
}

export function GreenBadge({ children, className }: BadgeProps) {
	return <Badge variant="outline" className={`bg-green-100 text-green-800 border-green-300 ${className}`}>
		{children}
	</Badge>
}

export function RedBadge({ children, className }: BadgeProps) {
	return <Badge variant="outline" className={`bg-red-100 text-red-800 border-red-300 ${className}`}>
		{children}
	</Badge>
}