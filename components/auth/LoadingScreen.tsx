'use client'

import { Loader2 } from 'lucide-react'

interface LoadingScreenProps {
	fullScreen?: boolean
	message?: string
}

/**
 * LoadingScreen Component
 * 
 * A generic loading component that displays a centered spinner with an optional message.
 * Can be rendered as fullscreen or within a container.
 * 
 * @param {LoadingScreenProps} props - Component props
 * @param {boolean} [props.fullScreen=false] - Whether to display as fullscreen
 * @param {string} [props.message='Cargando...'] - Custom loading message
 */
export default function LoadingScreen({
	fullScreen = false,
	message = 'Cargando...'
}: LoadingScreenProps) {
	const containerClasses = fullScreen
		? 'fixed inset-0 bg-background'
		: 'w-full h-full min-h-[100px]'

	return (
		<div className={`${containerClasses} flex items-center justify-center`}>
			<div className="text-center">
				<Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
				<p className="text-sm text-muted-foreground">{message}</p>
			</div>
		</div>
	)
} 