import { GreenBadge, RedBadge } from '@/components/common/Badges'

type QuestionStatusProps = {
	isActive: boolean,
	className?: string
}

export default function QuestionStatus(props: QuestionStatusProps) {
	return (
		props.isActive ?
			<GreenBadge className={props.className}>
				Activa
			</GreenBadge>
			:
			<RedBadge className={props.className}>
				Finalizada
			</RedBadge>
	)
}