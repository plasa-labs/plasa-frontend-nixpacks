'use client'

import { useReadContract } from 'wagmi'
import { contractsGetPlasa } from '@/lib/onchain/contracts'
import { PlasaView } from '@/lib/onchain/types/interfaces'
import { usePrivy } from '@privy-io/react-auth'

export const usePlasaData = () => {
	const { user } = usePrivy()
	const userAddress = user?.smartWallet?.address as `0x${string}`

	const contract = contractsGetPlasa(userAddress)
	const result = useReadContract(contract)

	return {
		...result,
		data: result.data as PlasaView
	}
}
