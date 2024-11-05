import Link from 'next/link'

/**
 * Footer component that displays copyright information and social media links
 * Renders at the bottom of the page with a border top and responsive layout
 */
export default function Footer() {
	return (
		<footer className="border-t border-border mt-auto">
			<div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-4 md:mb-0">
						<p className="text-sm">&copy; 2024 Plasa. All rights reserved.</p>
					</div>
					<nav className="flex space-x-4">
						<Link href="https://github.com/plasa-labs/" target="_blank" className="text-sm hover:underline">
							GitHub
						</Link>
						<Link href="https://t.me/nicoacosta8" target="_blank" className="text-sm hover:underline">
							Telegram
						</Link>
					</nav>
				</div>
			</div>
		</footer>
	)
}
