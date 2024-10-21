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
import { Navbar } from '@/app/components/Navbar'
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: "Plasa",
	description: "Real world governance",
}

export default function RootLayout({
	children,
}: {
	children: ReactNode
}) {
	const initialState = cookieToInitialState(
		getConfig(),
		headers().get('cookie')
	)
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={`${inter.className} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Providers initialState={initialState}>
						<Navbar />
						<main>{children}</main>
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	)
}
