export default [
	{
		inputs: [{ name: "user", type: "address" }],
		name: "getPlasaView",
		outputs: [
			{
				name: "",
				type: "tuple",
				components: [
					{
						name: "data",
						type: "tuple",
						components: [
							{ name: "contractAddress", type: "address" },
							{ name: "chainId", type: "uint256" },
							{ name: "version", type: "string" }
						]
					},
					{
						name: "user",
						type: "tuple",
						components: [
							{ name: "username", type: "string" }
						]
					},
					{
						name: "stamps",
						type: "tuple[]",
						components: [
							{
								name: "data",
								type: "tuple",
								components: [
									{ name: "contractAddress", type: "address" },
									{ name: "stampType", type: "uint8" },
									{ name: "name", type: "string" },
									{ name: "symbol", type: "string" },
									{ name: "totalSupply", type: "uint256" },
									{ name: "specific", type: "bytes" }
								]
							},
							{
								name: "user",
								type: "tuple",
								components: [
									{ name: "owns", type: "bool" },
									{ name: "stampId", type: "uint256" },
									{ name: "mintingTimestamp", type: "uint256" },
									{ name: "specific", type: "bytes" }
								]
							}
						]
					},
					{
						name: "spaces",
						type: "tuple[]",
						components: [
							{
								name: "data",
								type: "tuple",
								components: [
									{ name: "contractAddress", type: "address" },
									{ name: "name", type: "string" },
									{ name: "description", type: "string" },
									{ name: "imageUrl", type: "string" },
									{ name: "creationTimestamp", type: "uint256" }
								]
							},
							{
								name: "user",
								type: "tuple",
								components: [
									{
										name: "roles",
										type: "tuple",
										components: [
											{ name: "superAdmin", type: "bool" },
											{ name: "admin", type: "bool" },
											{ name: "mod", type: "bool" }
										]
									},
									{
										name: "permissions",
										type: "tuple",
										components: [
											{ name: "UpdateSpaceInfo", type: "bool" },
											{ name: "UpdateSpacePoints", type: "bool" },
											{ name: "UpdateQuestionInfo", type: "bool" },
											{ name: "UpdateQuestionDeadline", type: "bool" },
											{ name: "UpdateQuestionPoints", type: "bool" },
											{ name: "CreateFixedQuestion", type: "bool" },
											{ name: "CreateOpenQuestion", type: "bool" },
											{ name: "VetoFixedQuestion", type: "bool" },
											{ name: "VetoOpenQuestion", type: "bool" },
											{ name: "VetoOpenQuestionOption", type: "bool" },
											{ name: "LiftVetoFixedQuestion", type: "bool" },
											{ name: "LiftVetoOpenQuestion", type: "bool" },
											{ name: "LiftVetoOpenQuestionOption", type: "bool" },
											{ name: "AddOpenQuestionOption", type: "bool" }
										]
									}
								]
							}
						]
					}
				]
			}
		],
		stateMutability: "view",
		type: "function"
	}
] as const

