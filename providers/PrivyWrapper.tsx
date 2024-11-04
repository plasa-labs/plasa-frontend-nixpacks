"use client"

import { PrivyProvider } from '@privy-io/react-auth'
import { sepolia, baseSepolia } from 'viem/chains'
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets'

export function PrivyWrapper({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<PrivyProvider
			appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
			config={{
				loginMethods: ['google'],
				appearance: {
					// theme: 'light',
					// accentColor: '#676FFF',
					logo: 'https://i.postimg.cc/BvrVvBJz/d-d-v3-horizontal-transparent.png',
					landingHeader: 'Ingresá a D&D',
					// loginMessage: 'mensaje entre el logo y el botón de google',
				},
				intl: {
					defaultCountry: 'AR',
				},
				supportedChains: [sepolia, baseSepolia],
				defaultChain: sepolia,
				embeddedWallets: {
					createOnLogin: 'all-users',
				}
			}}
		>
			<SmartWalletsProvider>
				{children}
			</SmartWalletsProvider>
		</PrivyProvider>
	)
}