// @ts-nocheck
// _seed.ts
export async function seedModel<ModelName extends ModelNames>(
	target: ModelName,
	modelSeeds: ModelSeeds
): Promise<SeededResolverReturn<ModelName>[][]> {
	const mockFunctions = modelSeeds[target];
	if (!mockFunctions) {
		throw new Error(`Missing seed-function for "${target}"`);
	}
	const functionArray: SingleResolver<ModelName>[] = Array.isArray(mockFunctions) ? mockFunctions : [mockFunctions];

	let ret: PromiseLike<SeededResolverReturn<ModelName>[]>[] = [];

	for (const mockFunction of functionArray) {
		const neededModels = Object.keys(modelRelations[target]) as ModelNames[];

		const relatedData = (
			await Promise.all(
				neededModels.map(async model => {
					return {
						[model]: await seedModel(model, modelSeeds),
					};
				})
			)
		).reduce((obj, modelData) => {
			return {
				...obj,
				...modelData,
			};
		}, {}) as ResolverObject<ModelName>;

		const queries = mockFunction(relatedData);
		let returnArray = Array.isArray(queries) ? queries : [queries];
		ret.push(Promise.all(returnArray) as Promise<SeededResolverReturn<ModelName>[]>);
	}

	return Promise.all(ret);
}

export async function seedDatabase(modelSeeds: ModelSeeds) {
	const keys = Object.keys(modelSeeds) as ModelNames[];
	for (const name of keys) {
		await seedModel(name, modelSeeds);
	}
}
