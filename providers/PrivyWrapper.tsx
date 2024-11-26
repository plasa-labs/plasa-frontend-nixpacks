"use client"

import { PrivyProvider } from '@privy-io/react-auth'
import { baseSepolia } from 'viem/chains'
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function PrivyWrapper({
	children,
}: {
	children: React.ReactNode
}) {
	const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
	const { theme, systemTheme } = useTheme()
	const [privyTheme, setPrivyTheme] = useState<'light' | 'dark'>('light')

	useEffect(() => {
		if (theme === 'system') {
			setPrivyTheme(systemTheme as 'light' | 'dark')
		} else {
			setPrivyTheme(theme as 'light' | 'dark')
		}
	}, [theme, systemTheme])

	if (!privyAppId) {
		throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not defined')
	}

	return (
		<PrivyProvider
			appId={privyAppId}
			config={{
				loginMethods: ['google'],
				appearance: {
					theme: privyTheme,
					logo: '',
					// logo: 'https://i.postimg.cc/BvrVvBJz/d-d-v3-horizontal-transparent.png',
					landingHeader: 'Ingresá a D&D',
				},
				intl: {
					defaultCountry: 'AR',
				},
				supportedChains: [baseSepolia],
				defaultChain: baseSepolia,
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