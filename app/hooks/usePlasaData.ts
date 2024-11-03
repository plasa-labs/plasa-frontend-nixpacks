'use client'

import { useAccount, useReadContract } from 'wagmi'
import { contractsGetPlasa } from '@/lib/onchain/contracts'
import { PlasaView } from '@/lib/onchain/types/interfaces'

export const usePlasaData = () => {
	const { address: userAddress } = useAccount()
	const contract = contractsGetPlasa(userAddress)
	const result = useReadContract(contract)

	return {
		...result,
		data: result.data as PlasaView
	}
}
// Compare this snippet from app/hooks/use-plasa-data.ts: