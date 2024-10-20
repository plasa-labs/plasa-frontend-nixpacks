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

const inter = Inter({ subsets: ['latin'] })

// const geistSans = localFont({
// 	src: "./fonts/GeistVF.woff",
// 	variable: "--font-geist-sans",
// 	weight: "100 900",
// })
// const geistMono = localFont({
// 	src: "./fonts/GeistMonoVF.woff",
// 	variable: "--font-geist-mono",
// 	weight: "100 900",
// })

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
				// className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				className={`${inter.className} antialiased`}
			>
				<Providers initialState={initialState}>
					<Navbar />
					<main>{children}</main>
				</Providers>
			</body>
		</html>
	)
}
