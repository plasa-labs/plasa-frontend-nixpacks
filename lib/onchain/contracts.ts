import fixedQuestionAbi from './abi/fixed-question.json'
import spaceAbi from './abi/space.json'
import plasaAbi from './abi/plasa'
import followerSinceStampAbi from './abi/follower-since-stamp.json'

import {
	type Abi,
	type ContractFunctionParameters,
	type ReadContractParameters,
	encodeFunctionData,
} from 'viem'
import { baseSepolia, type Chain } from 'viem/chains'
// Read contracts

export const contractsGetPlasa = (userAddress: `0x${string}` | undefined): ReadContractParameters => {
	return {
		address: '0x6ae715986B4d26cDA8548589d1F76a178cB59005',
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

// Write contracts

export const contractsMintStamp = (
	stampAddress: `0x${string}`,
	since: number,
	deadline: number,
	signature: `0x${string}`
): { to: `0x${string}`, data: `0x${string}`, chain: Chain } => {
	const data = encodeFunctionData({
		abi: followerSinceStampAbi as Abi,
		functionName: 'mintStamp',
		args: [since, deadline, signature]
	})

	return {
		to: stampAddress,
		data,
		chain: baseSepolia
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
		chain: baseSepolia
	}
}

// Utils

const getValidAddress = (userAddress: `0x${string}` | undefined) => {
	return userAddress ? userAddress : '0x0000000000000000000000000000000000000001' as `0x${string}`
}
