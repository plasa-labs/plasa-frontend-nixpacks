import { UserResponse, InstagramCodeVerificationRequest, InstagramCodeVerificationResponse } from "./interfaces"

/**
 * Fetches user data from the API.
 * 
 * @param userId - The ID of the user to fetch.
 * @returns A promise that resolves to the user data.
 * @throws Will throw an error if the API_URL is not set, userId is not provided, or if the fetch fails.
 */
async function fetchUser(userId: string): Promise<UserResponse> {
	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

	// Check if API_URL environment variable is set
	if (!apiBaseUrl) {
		throw new Error('API_URL environment variable is not set')
	}

	// Check if userId is provided
	if (!userId) {
		throw new Error('User ID is required')
	}

	try {
		// Make a GET request to fetch user data
		const response = await fetch(`${apiBaseUrl}/user/${userId}`, {
			method: 'GET',
		})

		// Handle response errors
		if (!response.ok) {
			if (response.status === 400) {
				throw new Error('User ID is required')
			} else if (response.status === 500) {
				throw new Error('Failed to retrieve user data')
			} else {
				throw new Error('An unexpected error occurred')
			}
		}

		// Parse and return the user data
		const userData = await response.json()
		return userData as UserResponse
	} catch (error) {
		console.error('Error fetching user data:', error)
		throw error
	}
}

async function verifyInstagramCode(code: number, userId: string): Promise<InstagramCodeVerificationResponse> {
	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

	if (!apiBaseUrl) {
		throw new Error('API_URL environment variable is not set')
	}

	const requestBody: InstagramCodeVerificationRequest = {
		code,
		user_id: userId
	}

	try {
		const response = await fetch(`${apiBaseUrl}/instagram/verify`, {
			method: 'POST',
			body: JSON.stringify(requestBody),
		})

		const responseData = await response.json()
		return responseData as InstagramCodeVerificationResponse
	} catch (error) {
		console.error('Error verifying Instagram code:', error)
		throw error
	}
}

export { fetchUser, verifyInstagramCode }