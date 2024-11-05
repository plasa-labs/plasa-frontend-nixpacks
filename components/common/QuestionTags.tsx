import { Badge } from '@/components/ui/badge'

type QuestionTagsProps = {
	tags: string[],
	className?: string
}

export default function QuestionTags(props: QuestionTagsProps) {
	return (
		<div className={`flex flex-wrap gap-2 ${props.className}`}>
			{props.tags?.map((tag, index) => (
				<Badge key={index} variant="outline">{tag}</Badge>
			))}
		</div>
	)
}
