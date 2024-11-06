// Core React and Next.js imports
import { type ReactNode } from 'react'
import { headers } from 'next/headers'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

// Third-party imports
import { cookieToInitialState } from 'wagmi'

// Providers and contexts
import { OnchainProviders } from '@/providers/OnchainProviders'
import { ContextProviders } from '@/providers/ContextProviders'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { TransactionProvider } from '@/contexts/TransactionContext'

// Components
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/Footer'

// Utils and styles
import { getConfig } from '@/lib/onchain/wagmi'
import './globals.css'

// Font configuration
const inter = Inter({ subsets: ['latin'] })

/**
 * Metadata configuration for the application
 */
export const metadata: Metadata = {
	title: 'Plasa',
	description: 'Real world governance',
}

/**
 * Root layout component interface
 */
interface RootLayoutProps {
	children: ReactNode
}

/**
 * Root layout component that wraps the entire application
 * Provides theme support, blockchain connectivity, and global contexts
 * 
 * @param {RootLayoutProps} props - Component props
 * @param {ReactNode} props.children - Child components to render
 * @returns {Promise<JSX.Element>} The rendered layout
 */
export default async function RootLayout({ children }: RootLayoutProps) {
	const headersObject = await headers()
	const cookieHeader = headersObject.get('cookie')
	const initialState = cookieToInitialState(
		getConfig(),
		cookieHeader
	)

	return (
		<html lang='es' suppressHydrationWarning>
			<head />
			<body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<OnchainProviders initialState={initialState}>
						<ContextProviders>
							<TransactionProvider>
								<Navbar />
								<main>{children}</main>
								<Footer />
							</TransactionProvider>
						</ContextProviders>
					</OnchainProviders>
				</ThemeProvider>
			</body>
		</html>
	)
}
