'use client'

import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownBasename, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet'
import { Avatar, Name } from '@coinbase/onchainkit/identity'
import Link from 'next/link'

export function Navbar() {
	return (
		<nav className="border-b">
			<div className="container mx-auto flex justify-between items-center py-4">
				<Link href="/" className="text-xl font-bold">
					plasa
				</Link>
				<div className="flex justify-end">
					<Wallet>
						<ConnectWallet text="Conectar">
							<Avatar className="h-6 w-6" />
							<Name />
						</ConnectWallet>
						<WalletDropdown>
							<WalletDropdownBasename />
							<WalletDropdownDisconnect />
						</WalletDropdown>
					</Wallet>
				</div>
			</div>
		</nav>
	)
}
