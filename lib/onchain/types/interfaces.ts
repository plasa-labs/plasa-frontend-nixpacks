// Plasa Types
export interface PlasaData {
	contractAddress: string  // address
	namesContract: string   // address
}

export interface PlasaUser {
	isRegistered: boolean
	username: string
}

export interface PlasaView {
	data: PlasaData
	user: PlasaUser
}

// Points Types
export interface HolderData {
	user: string  // address
	name: string
	balance: bigint
}

export interface PointsData {
	contractAddress: string  // address
	name: string
	symbol: string
	totalSupply: bigint
	top10Holders: HolderData[]
}

export interface PointsUser {
	currentBalance: bigint
}

export interface PointsView {
	data: PointsData
	user: PointsUser
}

// Question Types
export enum QuestionType {
	Null,
	Open,
	Fixed
}

export interface QuestionData {
	contractAddress: string  // address
	questionType: QuestionType
	title: string
	description: string
	tags: string[]
	creator: string  // address
	kickoff: bigint
	deadline: bigint
	isActive: boolean
	voteCount: bigint
}

export interface QuestionUser {
	canVote: boolean
	pointsAtDeadline: bigint
}

export interface OptionData {
	title: string
	description: string
	proposer: string  // address
	voteCount: bigint
	pointsAtDeadline: bigint
}

export interface OptionUser {
	voted: boolean
}

export interface OptionView {
	data: OptionData
	user: OptionUser
}

export interface QuestionPreview {
	data: QuestionData
	user: QuestionUser
	points: PointsView
}

export interface QuestionView {
	data: QuestionData
	user: QuestionUser
	options: OptionView[]
	points: PointsView
}

// Stamp Types
export enum StampType {
	Null,
	AccountOwnership,
	FollowerSince
}

export interface StampData {
	contractAddress: string  // address
	stampType: StampType
	name: string
	symbol: string
	totalSupply: bigint
	specific: string  // bytes in hex
}

export interface StampUser {
	owns: boolean
	stampId: bigint
	mintingTimestamp: bigint
	specific: string  // bytes in hex
}

export interface StampView {
	data: StampData
	user: StampUser
}

// Points Stamp Types
export interface PointsStampData extends StampData {
	multiplier: bigint
}

// Space Types
export interface SpaceData {
	contractAddress: string  // address
	name: string
	description: string
	imageUrl: string
	creationTimestamp: bigint
}

export interface RolesUser {
	superAdmin: boolean
	admin: boolean
	mod: boolean
}

export interface PermissionsUser {
	UpdateSpaceInfo: boolean
	UpdateSpacePoints: boolean
	UpdateQuestionInfo: boolean
	UpdateQuestionDeadline: boolean
	UpdateQuestionPoints: boolean
	CreateFixedQuestion: boolean
	CreateOpenQuestion: boolean
	VetoFixedQuestion: boolean
	VetoOpenQuestion: boolean
	VetoOpenQuestionOption: boolean
	LiftVetoFixedQuestion: boolean
	LiftVetoOpenQuestion: boolean
	LiftVetoOpenQuestionOption: boolean
	AddOpenQuestionOption: boolean
}

export interface SpaceUser {
	roles: RolesUser
	permissions: PermissionsUser
}

export interface SpacePreview {
	data: SpaceData
	user: SpaceUser
}

export interface PointsStampView {
	data: PointsStampData
	user: StampUser
}

export interface MultipleFollowerSincePointsView {
	points: PointsView
	stamps: PointsStampView[]
}

export interface SpaceView {
	data: SpaceData
	user: SpaceUser
	points: MultipleFollowerSincePointsView
	questions: QuestionPreview[]
}

// Plasa Types
export interface PlasaData {
	contractAddress: string  // address
	chainId: bigint
	version: string
}

export interface PlasaUser {
	username: string
}

export interface PlasaView {
	data: PlasaData
	user: PlasaUser
	stamps: StampView[]
	spaces: SpacePreview[]
}
