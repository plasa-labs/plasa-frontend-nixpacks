import '@coinbase/onchainkit/styles.css'
import "./globals.css"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { headers } from 'next/headers'
import { type ReactNode } from 'react'
import { cookieToInitialState } from 'wagmi'

import { getConfig } from './wagmi'
import { Providers } from './OnchainProviders'

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
})
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
})

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
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers initialState={initialState}>{children}</Providers>
			</body>
		</html>
	)
}
