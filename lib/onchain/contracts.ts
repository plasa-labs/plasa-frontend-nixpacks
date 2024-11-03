import fixedQuestionAbi from './abi/fixed-question.json'
import spaceAbi from './abi/space.json'
import plasaAbi from './abi/plasa'
import followerSinceStampAbi from './abi/follower-since-stamp.json'

import { Abi, ContractFunctionParameters, ReadContractParameters } from 'viem'

// Read contracts

export const contractsGetPlasa = (userAddress: `0x${string}` | undefined) => {
	return {
		address: '0x6ae715986B4d26cDA8548589d1F76a178cB59005',
		abi: plasaAbi as Abi,
		functionName: 'getPlasaView',
		args: [getValidAddress(userAddress)],
	} as ReadContractParameters
}

export const contractsGetSpace = (spaceAddress: `0x${string}`, userAddress: `0x${string}` | undefined) => {
	return {
		address: spaceAddress,
		abi: spaceAbi as Abi,
		functionName: 'getSpaceView',
		args: [getValidAddress(userAddress)],
	} as ReadContractParameters
}

export const contractsGetQuestion = (questionAddress: `0x${string}`, userAddress: `0x${string}` | undefined) => {
	return {
		address: questionAddress,
		abi: fixedQuestionAbi as Abi,
		functionName: 'getQuestionView',
		args: [getValidAddress(userAddress)],
	} as ReadContractParameters
}

// Write contracts

export const contractsMintStamp = (stampAddress: `0x${string}`, since: number, deadline: number, signature: `0x${string}`) => {
	return [{
		address: stampAddress,
		abi: followerSinceStampAbi as Abi,
		functionName: 'mintStamp',
		args: [since, deadline, signature],
	}] as ContractFunctionParameters[]
}

export const contractsVote = (questionAddress: `0x${string}`, optionIndex: number) => {
	return [{
		address: questionAddress,
		abi: fixedQuestionAbi as Abi,
		functionName: 'vote',
		args: [optionIndex],
	}] as ContractFunctionParameters[]
}

// Utils

const getValidAddress = (userAddress: `0x${string}` | undefined) => {
	return userAddress ? userAddress : '0x0000000000000000000000000000000000000001' as `0x${string}`
}
