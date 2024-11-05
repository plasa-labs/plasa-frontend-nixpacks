'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { PrivyWrapper } from '@/providers/PrivyWrapper'

import { getConfig } from '@/lib/onchain/wagmi'

export function OnchainProviders(props: {
	children: ReactNode
	initialState?: State
}) {
	const [config] = useState(() => getConfig())

	const [queryClient] = useState(() => new QueryClient())

	return (
		<PrivyWrapper>
			<WagmiProvider config={config} initialState={props.initialState}>
				<QueryClientProvider client={queryClient}>
					{props.children}
				</QueryClientProvider>
			</WagmiProvider>
		</PrivyWrapper >
	)
}