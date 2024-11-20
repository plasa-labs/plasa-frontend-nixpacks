import { UserData } from "./interfaces"

/**
 * Fetches user data from the API.
 * 
 * @param userId - The ID of the user to fetch.
 * @returns A promise that resolves to the user data.
 * @throws Will throw an error if the API_URL is not set, userId is not provided, or if the fetch fails.
 */
async function fetchUser(userId: string): Promise<UserData> {
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
		return userData as UserData
	} catch (error) {
		console.error('Error fetching user data:', error)
		throw error
	}
}

/**
 * Sets the Instagram username for a user.
 * 
 * @param userId - The ID of the user.
 * @param username - The Instagram username to set.
 * @returns A promise that resolves to the updated user data.
 * @throws Will throw an error if the API_URL is not set, userId or username is not provided, or if the fetch fails.
 */
async function setInstagramUsername(userId: string, username: string): Promise<UserData> {
	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

	// Check if API_URL environment variable is set
	if (!apiBaseUrl) {
		throw new Error('API_BASE_URL environment variable is not set')
	}
	console.log('API Base URL:', apiBaseUrl)

	// Check if userId is provided
	if (!userId) {
		throw new Error("User ID is required")
	}

	// Check if Instagram username is provided
	if (!username) {
		throw new Error('Instagram username is required')
	}

	try {
		const url = `${apiBaseUrl}/user/${userId}/instagram`
		// Updated to POST request with JSON body
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username }),
		})
		console.log('Response:', response)

		// Handle response errors
		if (!response.ok) {
			if (response.status === 400) {
				throw new Error('User ID is required or Instagram username is required')
			} else if (response.status === 500) {
				throw new Error('Failed to set Instagram username')
			} else {
				throw new Error('An unexpected error occurred')
			}
		}

		// Parse and return the updated user data
		const updatedUserData = await response.json()
		console.log('Updated user data:', updatedUserData)

		return updatedUserData as UserData
	} catch (error) {
		console.error('Error setting Instagram username:', error)
		throw error
	}
}

export { fetchUser, setInstagramUsername }