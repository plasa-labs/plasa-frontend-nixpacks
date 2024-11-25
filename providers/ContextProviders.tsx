'use client'

import { type ReactNode } from 'react'

import { PlasaProvider } from '@/contexts/PlasaContext'
import { SpaceProvider } from '@/contexts/SpaceContext'
import { FirestoreProvider } from '@/contexts/FirestoreContext'
import { RegistrationProvider } from '@/contexts/RegistrationContext'

export function ContextProviders(props: {
	children: ReactNode
}) {
	return (
		<PlasaProvider>
			<SpaceProvider>
				<FirestoreProvider>
					<RegistrationProvider>
						{props.children}
					</RegistrationProvider>
				</FirestoreProvider>
			</SpaceProvider>
		</PlasaProvider>
	)
}
