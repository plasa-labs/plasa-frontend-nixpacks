'use client'

import { type ReactNode } from 'react'
import { type State } from 'wagmi'

import { PlasaProvider } from '@/contexts/PlasaContext'
import { SpaceProvider } from '@/contexts/SpaceContext'
import { FirestoreProvider } from '@/contexts/FirestoreContext'

export function ContextProviders(props: {
	children: ReactNode
}) {
	return (
		<PlasaProvider>
			<SpaceProvider>
				<FirestoreProvider>
					{props.children}
				</FirestoreProvider>
			</SpaceProvider>
		</PlasaProvider>
	)
}
