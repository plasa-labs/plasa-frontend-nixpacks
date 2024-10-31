import '@coinbase/onchainkit/styles.css'
import "./globals.css"
import type { Metadata } from "next"
// import localFont from "next/font/local"
import { headers } from 'next/headers'
import { type ReactNode } from 'react'
import { cookieToInitialState } from 'wagmi'

import { Inter } from 'next/font/google'

import { getConfig } from './wagmi'
import { Providers } from './OnchainProviders'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from "@/components/theme-provider"

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
					<Providers initialState={initialState}>
						<Navbar />
						<main>{children}</main>
						<Footer />
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	)
}
