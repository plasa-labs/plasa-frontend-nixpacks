import fixedQuestionAbi from './abi/fixed-question.json'
import spaceAbi from './abi/space.json'
import plasaABI from './abi/plasa'

import { Abi, ContractFunctionParameters, ReadContractParameters } from 'viem'

export const contractsVote = (questionAddress: `0x${string}`, optionIndex: number) => {
	return [{
		address: questionAddress,
		abi: fixedQuestionAbi as Abi,
		functionName: 'vote',
		args: [optionIndex],
	}] as ContractFunctionParameters[]
}



export const contractsGetQuestion = (questionAddress: `0x${string}`, userAddress: `0x${string}`) => {
	return {
		address: questionAddress,
		abi: fixedQuestionAbi as Abi,
		functionName: 'getQuestionView',
		args: [getValidAddress(userAddress)],
	} as ReadContractParameters
}

export const contractsGetSpace = (spaceAddress: `0x${string}`, userAddress: `0x${string}`) => {
	return {
		address: spaceAddress,
		abi: spaceAbi as Abi,
		functionName: 'getSpaceView',
		args: [getValidAddress(userAddress)],
	} as ReadContractParameters
}

export const contractsGetPlasa = (userAddress: `0x${string}` | undefined) => {
	return {
		address: '0xB118054847d57c1183B8362AA6fE1196c21aff39',
		abi: plasaABI as Abi,
		functionName: 'getPlasaView',
		args: [getValidAddress(userAddress)],
	} as ReadContractParameters
}

const getValidAddress = (userAddress: `0x${string}` | undefined) => {
	return userAddress ? userAddress : '0x0000000000000000000000000000000000000001' as `0x${string}`
}
