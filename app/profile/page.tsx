'use client'

import Profile from '@/components/profile/Profile'
import RequireRegistration from '@/components/auth/RequireRegistration'

export default function ProfilePage() {
	return (
		<RequireRegistration>
			<Profile />
		</RequireRegistration>
	)
}
