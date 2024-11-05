// Third-party imports
import '@coinbase/onchainkit/styles.css'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { type ReactNode } from 'react'
import { cookieToInitialState } from 'wagmi'

// Styles
import "./globals.css"

// Types
import type { Metadata } from "next"

// Providers and contexts
import { OnchainProviders } from '@/providers/OnchainProviders'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { SpaceProvider } from '@/contexts/SpaceContext'
import { FirestoreProvider } from '@/contexts/FirestoreContext'

// Components
import { Navbar } from '@/components/navigation/Navbar'
import { Footer } from '@/components/Footer'

// Utils
import { getConfig } from '@/lib/onchain/wagmi'

// Font configuration
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: "Plasa",
	description: "Real world governance",
}

export default async function RootLayout({
	children,
}: {
	children: ReactNode
}) {
	const headersObject = await headers()
	const cookieHeader = headersObject.get('cookie')
	const initialState = cookieToInitialState(
		getConfig(),
		cookieHeader
	)

	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<OnchainProviders initialState={initialState}>
						<SpaceProvider>
							<FirestoreProvider>
								<Navbar />
								<main>{children}</main>
								<Footer />
							</FirestoreProvider>
						</SpaceProvider>
					</OnchainProviders>
				</ThemeProvider>
			</body>
		</html>
	)
}
