'use client'

import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownBasename, WalletDropdownDisconnect, WalletDropdownLink } from '@coinbase/onchainkit/wallet'
import { Name } from '@coinbase/onchainkit/identity'
import Image from 'next/image'
import Link from 'next/link'

export function Navbar() {
	return (
		<nav className="border-b border-border">
			<div className="container mx-auto flex justify-between items-center py-4">
				<Link href="/" className="flex-shrink-0">
					<Image src="https://raw.githubusercontent.com/plasa-labs/brand/refs/heads/main/logos/horizontal/black-text-transparent-bg-fit.png" alt="D&D Logo" width={100} height={40} />
				</Link>
				<div className="flex justify-end">
					<Wallet>
						<ConnectWallet text="Conectar" className="bg-secondary text-primary hover:bg-secondary/90">
							<Name className="text-primary" />
						</ConnectWallet>
						<WalletDropdown className="bg-secondary text-primary hover:bg-secondary/90">
							<WalletDropdownBasename className="bg-secondary text-primary" />
							<WalletDropdownLink href="/profile" className="bg-secondary text-primary">
								Mi perfil
							</WalletDropdownLink>
							<WalletDropdownDisconnect className="bg-secondary text-primary hover:text-primary/90" />
						</WalletDropdown>
					</Wallet>
				</div>
			</div>
		</nav>
	)
}
