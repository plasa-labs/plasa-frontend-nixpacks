/**
 * @fileoverview Home page component - Root page of the application
 * displaying the main Space component.
 */

import Space from '@/components/space/Space'

/**
 * Home page component that serves as the root route (/)
 * @returns {JSX.Element} The rendered Space component
 */
export default function Home() {
	return <Space />
}
