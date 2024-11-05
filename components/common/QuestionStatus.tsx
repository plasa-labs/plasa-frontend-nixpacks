import { Badge } from '@/components/ui/badge'

type QuestionStatusProps = {
	isActive: boolean,
	className?: string
}

export default function QuestionStatus(props: QuestionStatusProps) {
	return (
		<Badge variant={props.isActive ? 'default' : 'secondary'} className={props.className}>
			{props.isActive ? 'Activa' : 'Finalizada'}
		</Badge>
	)
}