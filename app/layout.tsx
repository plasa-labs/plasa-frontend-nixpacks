// Core React and Next.js imports
import { type ReactNode } from 'react'
import { headers } from 'next/headers'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

// Third-party imports
import '@coinbase/onchainkit/styles.css'
import { cookieToInitialState } from 'wagmi'

// Providers and contexts
import { OnchainProviders } from '@/providers/OnchainProviders'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { SpaceProvider } from '@/contexts/SpaceContext'
import { FirestoreProvider } from '@/contexts/FirestoreContext'

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
		<html lang='en' suppressHydrationWarning>
			<head />
			<body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
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
