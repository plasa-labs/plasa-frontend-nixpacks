import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { usePrivy } from '@privy-io/react-auth'
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets'
import { useState } from 'react'

interface TransactionButtonProps {
	text: string
	loadingText?: string
	className?: string
	disabled?: boolean
	// New props for transaction details
	transactionData: {
		to: string
		data: string
	}
	onSuccess?: () => void
	onError?: (error: Error) => void
}

export const TransactionButton = ({
	text,
	loadingText = "Procesando...",
	className = "",
	disabled = false,
	transactionData,
	onSuccess,
	onError
}: TransactionButtonProps) => {
	const [isProcessing, setIsProcessing] = useState(false)
	const [isProcessed, setIsProcessed] = useState(false)
	const { authenticated } = usePrivy()
	const { client } = useSmartWallets()

	const handleTransaction = async () => {
		if (!client || !authenticated) {
			console.log('Transaction aborted: Missing client or not authenticated')
			return
		}

		try {
			setIsProcessing(true)
			console.log('Sending transaction:', {
				to: transactionData.to,
				data: transactionData.data,
				account: client.account
			})

			const txReceipt = await client.sendTransaction({
				to: transactionData.to as `0x${string}`,
				data: transactionData.data as `0x${string}`,
				account: client.account
			})

			console.log('Transaction receipt:', {
				receipt: txReceipt
			})
			setIsProcessed(true)
			onSuccess?.()
		} catch (error) {
			console.error('Transaction failed:', error)
			onError?.(error as Error)
		} finally {
			setIsProcessing(false)
		}
	}

	return (
		<Button
			onClick={handleTransaction}
			className={className}
			disabled={disabled || isProcessing || !authenticated || !client || isProcessed}
		>
			{isProcessing ? (
				<>
					<Progress value={100} className="absolute inset-0 h-full rounded-md" />
					<span className="relative z-10">{loadingText}</span>
				</>
			) : isProcessed ? (
				"¡Listo!"
			) : (
				text
			)}
		</Button>
	)
} 