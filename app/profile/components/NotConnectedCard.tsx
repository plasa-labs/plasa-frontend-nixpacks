import { Card, CardContent } from "@/components/ui/card"

export function NotConnectedCard() {
	return (
		<Card className="w-full max-w-md mx-auto mt-8">
			<CardContent className="pt-6">
				<p className="text-center">Conectá tu cuenta para ver tu perfil.</p>
			</CardContent>
		</Card>
	)
}
