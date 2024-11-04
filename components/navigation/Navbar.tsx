'use client'

import Link from 'next/link'
// import Image from 'next/image'

// import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownBasename, WalletDropdownDisconnect, WalletDropdownLink } from '@coinbase/onchainkit/wallet'
// import { Name } from '@coinbase/onchainkit/identity'
import { NavUserButton } from './NavUserButton'

import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Public_Sans } from 'next/font/google'

const publicSans = Public_Sans({ subsets: ['latin'] })

export function Navbar() {
	return (
		<nav className="border-b border-border">
			<div className="container-base flex justify-between items-center py-4">
				<Link href="/" className="flex-shrink-0">
					<h1 className={`text-4xl font-medium tracking-tighter ${publicSans.className}`}>plasa</h1>
				</Link>
				<div className="flex items-center gap-4">
					<NavUserButton className="h-10 md:h-12" />
					<ThemeToggle buttonStyle="h-10 w-10 md:h-12 md:w-12" />
				</div>
			</div>
		</nav>
	)
}
