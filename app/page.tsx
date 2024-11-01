import { Space } from '@/components/space/Space'

export default function Home() {
	return <Space spaceAddress={process.env.NEXT_PUBLIC_SPACE_ADDRESS as string} />
}
