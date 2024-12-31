import fixedQuestionAbi from './abi/fixed-question.json'
import spaceAbi from './abi/space.json'
import plasaAbi from './abi/plasa.json'
import followerSinceStampAbi from './abi/follower-since-stamp.json'
import namesAbi from './abi/names.json'
import openQuestionAbi from './abi/open-question.json'

import {
	type Abi,
	type ReadContractParameters,
	encodeFunctionData,
} from 'viem'

import { baseSepolia, type Chain } from 'viem/chains'

const CHAIN = baseSepolia

// Read contracts

export const contractsGetPlasa = (userAddress: `0x${string}` | undefined): ReadContractParameters => {
	return {
		address: process.env.NEXT_PUBLIC_PLASA_ADDRESS as `0x${string}`,
		abi: plasaAbi as Abi,
		functionName: 'getPlasaView',
		args: [getValidAddress(userAddress)],
	}
}

export const contractsGetSpace = (spaceAddress: `0x${string}`, userAddress: `0x${string}` | undefined): ReadContractParameters => {
	return {
		address: spaceAddress,
		abi: spaceAbi as Abi,
		functionName: 'getSpaceView',
		args: [getValidAddress(userAddress)],
	}
}

export const contractsGetQuestion = (questionAddress: `0x${string}`, userAddress: `0x${string}` | undefined): ReadContractParameters => {
	return {
		address: questionAddress,
		abi: fixedQuestionAbi as Abi,
		functionName: 'getQuestionView',
		args: [getValidAddress(userAddress)],
	}
}

export const contractsGetNameAvailability = (name: string, namesAddress: `0x${string}`): ReadContractParameters => {
	return {
		address: namesAddress,
		abi: namesAbi as Abi,
		functionName: 'isAvailable',
		args: [name]
	}
}

// export const contractsGetUserName = (userAddress: `0x${string}`): ReadContractParameters => {
// 	return {
// 		address: process.env.NEXT_PUBLIC_NAMES_ADDRESS as `0x${string}`,
// 		abi: namesAbi as Abi,
// 		functionName: 'userToName',
// 		args: [getValidAddress(userAddress)]
// 	}
// }

// Write contracts

export const contractsMintStamp = (
	stampAddress: `0x${string}`,
	since: number,
	deadline: number,
	signature: `0x${string}`
): { to: `0x${string}`, data: `0x${string}`, chain: Chain } => {
	const data = encodeFunctionData({
		abi: followerSinceStampAbi as Abi,
		functionName: 'mintWithSignature',
		args: [since, deadline, signature]
	})

	return {
		to: stampAddress,
		data,
		chain: CHAIN
	}
}

export const contractsVote = (
	questionAddress: `0x${string}`,
	optionIndex: number
): { to: `0x${string}`, data: `0x${string}`, chain: Chain } => {
	const data = encodeFunctionData({
		abi: fixedQuestionAbi as Abi,
		functionName: 'vote',
		args: [optionIndex]
	})

	return {
		to: questionAddress,
		data,
		chain: CHAIN
	}
}

export const contractsAddOption = (
	questionAddress: `0x${string}`,
	title: string,
	description: string
): { to: `0x${string}`, data: `0x${string}`, chain: Chain } => {
	const data = encodeFunctionData({
		abi: openQuestionAbi as Abi,
		functionName: 'addOption',
		args: [title, description]
	})

	return {
		to: questionAddress,
		data,
		chain: CHAIN
	}
}

export const contractsMintName = (
	namesAddress: `0x${string}`,
	name: string
): { to: `0x${string}`, data: `0x${string}`, chain: Chain } => {
	const data = encodeFunctionData({
		abi: namesAbi as Abi,
		functionName: 'mintName',
		args: [name]
	})

	return {
		to: namesAddress,
		data,
		chain: CHAIN
	}
}

export const contractsVetoOption = (
	questionAddress: `0x${string}`,
	optionIndex: number
): { to: `0x${string}`, data: `0x${string}`, chain: Chain } => {
	const data = encodeFunctionData({
		abi: openQuestionAbi as Abi,
		functionName: 'vetoOption',
		args: [optionIndex]
	})

	return {
		to: questionAddress,
		data,
		chain: CHAIN
	}
}

export const contractsLiftOptionVeto = (
	questionAddress: `0x${string}`,
	optionIndex: number
): { to: `0x${string}`, data: `0x${string}`, chain: Chain } => {
	const data = encodeFunctionData({
		abi: openQuestionAbi as Abi,
		functionName: 'liftOptionVeto',
		args: [optionIndex]
	})

	return {
		to: questionAddress,
		data,
		chain: CHAIN
	}
}

// Utils

const getValidAddress = (userAddress: `0x${string}` | undefined) => {
	return userAddress ? userAddress : '0x0000000000000000000000000000000000000001' as `0x${string}`
}
