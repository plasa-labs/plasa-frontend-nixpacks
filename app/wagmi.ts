import { createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { baseSepolia } from 'viem/chains'

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[baseSepolia],
	[publicProvider()]
)

export const wagmiConfig = createConfig({
	autoConnect: true,
	publicClient,
	webSocketPublicClient,
})
