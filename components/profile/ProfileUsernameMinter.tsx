'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import TransactionButton from '@/components/common/TransactionButton'
import { contractsMintName } from '@/lib/onchain/contracts'
import { contractsGetNameAvailability } from '@/lib/onchain/contracts'
import { useReadContract } from 'wagmi'
import { usePlasa } from '@/contexts/PlasaContext'

// Contract-side validation is also performed
const forbiddenStrings = ['admin', 'moderator', 'mod', 'staff', 'support', 'plasa', 'ddfundacion']

export default function ProfileUsernameMinter() {
	const { setUsername } = usePlasa()

	const [pretendedUsername, setPretendedUsername] = useState('')
	const [isUsernameValid, setIsUsernameValid] = useState(false)
	const [isUsernameAvailable, setIsUsernameAvailable] = useState(false)
	const [isCheckingUsername, setIsCheckingUsername] = useState(false)
	const [usernameError, setUsernameError] = useState('')

	const validateUsername = useCallback((value: string) => {
		if (value.length === 0) {
			setIsUsernameValid(false)
			setUsernameError('')
			return
		}
		if (value.length < 3) {
			setIsUsernameValid(false)
			setUsernameError('El nombre de usuario debe tener al menos 3 caracteres.')
			return
		}
		if (value.length > 30) {
			setIsUsernameValid(false)
			setUsernameError('El nombre de usuario no puede tener más de 30 caracteres.')
			return
		}
		if (!/^[a-zA-Z0-9]+$/.test(value)) {
			setIsUsernameValid(false)
			setUsernameError('El nombre de usuario solo puede contener letras y números.')
			return
		}
		const forbiddenString = forbiddenStrings.find(str => value.toLowerCase().includes(str))
		if (forbiddenString) {
			setIsUsernameValid(false)
			setUsernameError(`El nombre de usuario no puede contener "${forbiddenString}".`)
			return
		}
		setIsUsernameValid(true)
		setUsernameError('')
	}, [])

	const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setPretendedUsername(value)
		validateUsername(value)
	}, [validateUsername])

	const usernameCache = useRef(new Map<string, boolean>())
	const cacheExpirationTime = 5 * 60 * 1000 // 5 minutes

	const contract = contractsGetNameAvailability(pretendedUsername)
	const { data: isAvailableData } = useReadContract(contract)

	const checkUsernameAvailability = useCallback(async () => {
		if (!isUsernameValid) return
		setIsCheckingUsername(true)

		await new Promise(resolve => setTimeout(resolve, 100))

		try {
			const cachedResult = usernameCache.current.get(pretendedUsername)
			if (cachedResult !== undefined) {
				setIsUsernameAvailable(cachedResult)
			} else {
				setIsUsernameAvailable(!!isAvailableData)

				usernameCache.current.set(pretendedUsername, !!isAvailableData)
				setTimeout(() => {
					usernameCache.current.delete(pretendedUsername)
				}, cacheExpirationTime)
			}
		} catch (error) {
			console.error('Error checking pretendedUsername availability:', error)
			setIsUsernameAvailable(false)
		} finally {
			setIsCheckingUsername(false)
		}
	}, [isUsernameValid, pretendedUsername, cacheExpirationTime, isAvailableData])

	useEffect(() => {
		if (isUsernameValid) {
			const timer = setTimeout(() => {
				checkUsernameAvailability()
			}, 500)
			return () => clearTimeout(timer)
		}
	}, [isUsernameValid, checkUsernameAvailability])

	const onNameMint = async (pretendedUsername: string) => {
		setUsername(pretendedUsername)
	}

	return (
		<div className="space-y-4">
			<Input
				type="text"
				placeholder="Ingresa tu nombre de usuario"
				value={pretendedUsername}
				onChange={handleUsernameChange}
				className={`w-full ${pretendedUsername && !isCheckingUsername
					? isUsernameValid && isUsernameAvailable
						? 'border-primary'
						: 'border-destructive'
					: ''
					}`}
			/>
			{usernameError && (
				<div className="text-sm text-destructive">{usernameError}</div>
			)}
			{isCheckingUsername && (
				<div className="text-sm text-muted-foreground flex items-center">
					<Loader2 className="w-4 h-4 mr-2 animate-spin" />
					Verificando disponibilidad...
				</div>
			)}
			{!isCheckingUsername && isUsernameValid && isUsernameAvailable && (
				<div className="text-sm text-primary">¡Nombre de usuario disponible!</div>
			)}
			{!isCheckingUsername && isUsernameValid && !isUsernameAvailable && (
				<div className="text-sm text-destructive">Nombre de usuario no disponible</div>
			)}

			<TransactionButton
				text="Obtener nombre de usuario"
				disabled={!isUsernameValid || !isUsernameAvailable || isCheckingUsername}
				transactionData={contractsMintName(pretendedUsername)}
				className="w-full"
				onSuccess={() => onNameMint(pretendedUsername)}
			/>
		</div>
	)
}
