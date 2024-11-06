import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { usePrivy } from '@privy-io/react-auth'
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets'
import { useState } from 'react'
import { useTransaction } from '@/contexts/TransactionContext'

/**
 * Interface for transaction data structure
 */
interface TransactionData {
	to: string
	data: string
}

/**
 * Props interface for the TransactionButton component
 */
interface TransactionButtonProps {
	/** Main button text */
	text: string
	/** Text to display while transaction is processing */
	loadingText?: string
	/** Additional CSS classes */
	className?: string
	/** Disable button state */
	disabled?: boolean
	/** Transaction details including destination and data */
	transactionData: TransactionData
	/** Callback function on successful transaction */
	onSuccess?: () => void
	/** Callback function on transaction error */
	onError?: (error: Error) => void
}

/**
 * TransactionButton Component
 * 
 * A button component that handles blockchain transactions using Privy smart wallets.
 * Displays different states (idle, processing, completed) and handles transaction flow.
 * 
 * @param props - TransactionButtonProps
 * @returns React component
 */
export default function TransactionButton({
	text,
	loadingText = "Procesando...",
	className = "",
	disabled = false,
	transactionData,
	onSuccess,
	onError
}: TransactionButtonProps) {
	const [isProcessing, setIsProcessing] = useState(false)
	const [isProcessed, setIsProcessed] = useState(false)
	const { authenticated } = usePrivy()
	const { client } = useSmartWallets()
	const { isAnyTransactionProcessing, setIsAnyTransactionProcessing } = useTransaction()

	const handleTransaction = async () => {
		if (!client || !authenticated) {
			console.log('Transaction aborted: Missing client or not authenticated')
			return
		}

		try {
			setIsProcessing(true)
			setIsAnyTransactionProcessing(true)
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
			setIsAnyTransactionProcessing(false)
		}
	}

	return (
		<Button
			onClick={handleTransaction}
			className={`relative ${className} ${(isAnyTransactionProcessing && !isProcessing) ?
				"opacity-50 cursor-not-allowed" : ""
				}`}
			disabled={disabled || isProcessing || !authenticated || !client || isProcessed || isAnyTransactionProcessing}
		>
			{isProcessing ? (
				<>
					<Progress
						value={100}
						className="absolute inset-0 h-full w-full rounded-md"
					/>
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