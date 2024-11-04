import '@coinbase/onchainkit/styles.css'
import "./globals.css"
import type { Metadata } from "next"
// import localFont from "next/font/local"
import { headers } from 'next/headers'
import { type ReactNode } from 'react'
import { cookieToInitialState } from 'wagmi'
import { OnchainProviders } from '@/providers/OnchainProviders'

import { Inter } from 'next/font/google'

import { getConfig } from '@/lib/onchain/wagmi'
// import { Providers } from '@/providers/OnchainProviders'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { SpaceProvider } from '@/contexts/SpaceContext'

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
							<Navbar />
							<main>{children}</main>
							<Footer />
						</SpaceProvider>
					</OnchainProviders>
				</ThemeProvider>
			</body>
		</html>
	)
}
