// import Link from 'next/link'

/**
 * Footer component that displays copyright information and social media links
 * Renders at the bottom of the page with a border top and responsive layout
 */
export default function Footer() {
	return (
		<footer className="border-t border-border mt-auto">
			<div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
				<div className="text-center">
					<p className="text-sm">&copy; 2024 D&D. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}
