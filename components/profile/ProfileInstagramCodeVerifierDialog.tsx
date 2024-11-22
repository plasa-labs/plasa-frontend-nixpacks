'use client'

import { useState } from 'react'
import { Instagram, MessageCircle, Key, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { usePrivy } from '@privy-io/react-auth'
import { useFirestore } from '@/contexts/FirestoreContext'
import { verifyInstagramCode } from '@/lib/api/endpoints'
import { InstagramCodeVerificationStatus } from '@/lib/api/interfaces'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { REGEXP_ONLY_DIGITS } from 'input-otp'

const FormSchema = z.object({
	pin: z.string().min(6, {
		message: "El código debe tener 6 caracteres.",
	}),
})

export default function ProfileInstagramCodeVerifierDialog() {
	const [verificationStatus, setVerificationStatus] = useState<InstagramCodeVerificationStatus | null>(null)
	const [isVerifying, setIsVerifying] = useState(false)

	const { user } = usePrivy()
	const { updateUserFirestore } = useFirestore()

	const smartWalletAddress = user?.smartWallet?.address

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			pin: "",
		},
	})

	const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
		if (!smartWalletAddress) return

		setIsVerifying(true)
		try {
			const code = parseInt(data.pin)
			console.log('code', code)
			console.log('smartWalletAddress', smartWalletAddress)

			const response = await verifyInstagramCode(code, smartWalletAddress)
			setVerificationStatus(response.status)

			if (response.status === InstagramCodeVerificationStatus.SUCCESS) {
				updateUserFirestore({
					instagram_username: response.user_data.instagram_username,
					available_stamps: response.user_data.available_stamps
				})
			}
		} catch (error) {
			console.error('Error verifying Instagram code:', error)
			setVerificationStatus(InstagramCodeVerificationStatus.INVALID_CODE)
		} finally {
			setIsVerifying(false)
		}
	}

	return (
		<DialogContent className="max-w-md">
			<DialogHeader>
				<DialogTitle>Conectar Instagram</DialogTitle>
			</DialogHeader>

			<div className="space-y-6">
				<div className="bg-muted p-4 rounded-md space-y-2">
					<h3 className="font-semibold">Cómo obtener tu código:</h3>
					<ol className="list-decimal list-inside space-y-1">
						<li className="flex items-center">
							<Instagram className="w-4 h-4 mr-2" />
							Abrí Instagram
						</li>
						<li className="flex items-center">
							<Search className="w-4 h-4 mr-2" />
							Buscá @ddfundacion
						</li>
						<li className="flex items-center">
							<MessageCircle className="w-4 h-4 mr-2" />
							Enviá un mensaje directo
						</li>
						<li className="flex items-center">
							<Key className="w-4 h-4 mr-2" />
							Recibí automáticamente el código
						</li>
					</ol>
				</div>

				<Form {...form} >
					<form onSubmit={form.handleSubmit(handleSubmit)} className="w-2/3 space-y-6">
						<FormField
							control={form.control}
							name="pin"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ingresá el código</FormLabel>
									<FormControl>
										<InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
											</InputOTPGroup>
											<InputOTPSeparator />
											<InputOTPGroup>
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									{/* <FormDescription>
										Por favor, ingresá el código enviado a tu teléfono.
									</FormDescription> */}
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full" disabled={isVerifying}>
							{isVerifying ? 'Verificando...' : 'Verificar código'}
						</Button>
					</form>
				</Form>

				<AnimatePresence>
					{verificationStatus && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
							className={`p-4 rounded-md ${verificationStatus === InstagramCodeVerificationStatus.SUCCESS
								? 'bg-green-100 text-green-800'
								: 'bg-red-100 text-red-800'
								}`}
						>
							<p className="text-sm font-medium">{verificationStatus}</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div >
		</DialogContent >
	)
}