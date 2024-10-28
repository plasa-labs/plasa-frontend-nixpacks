'use client'

import Link from 'next/link'
// import Image from 'next/image'

import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownBasename, WalletDropdownDisconnect, WalletDropdownLink } from '@coinbase/onchainkit/wallet'
import { Name } from '@coinbase/onchainkit/identity'

import { ThemeToggle } from '@/components/theme-toggle'
import { Public_Sans } from 'next/font/google'

const publicSans = Public_Sans({ subsets: ['latin'] })

export function Navbar() {
	return (
		<nav className="border-b border-border">
			<div className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
				<Link href="/" className="flex-shrink-0">
					<h1 className={`text-4xl font-medium tracking-tighter ${publicSans.className}`}>plasa</h1>
				</Link>
				<div className="flex justify-end">
					<Wallet>
						<ConnectWallet text="Conectar">
							<Name />
						</ConnectWallet>
						<WalletDropdown>
							<WalletDropdownBasename />
							<WalletDropdownLink href="/profile">
								Mi perfil
							</WalletDropdownLink>
							<WalletDropdownDisconnect />
						</WalletDropdown>
					</Wallet>
					<div className="ml-4 flex items-center">
						<ThemeToggle buttonStyle="ml-2 h-12 w-12" />
					</div>
				</div>
			</div>
		</nav>
	)
}
