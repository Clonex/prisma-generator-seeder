// @ts-nocheck
// _seed.ts

async function seedParentRelation<ModelName extends ModelNames>(
	target: ModelName,
	data: Awaited<SeededResolverReturn<ModelName>>[],
	modelSeeds: ModelSeeds,
	childData: Partial<ResolverObject<ModelName>> = {}
) {
	const parents = modelRelationsRevereLookup[target].filter(parent => !(parent in childData));
	if (parents.length > 0) {
		await Promise.all(
			data
				.map(resolvedData =>
					parents.map(parent =>
						seedModel(parent as ModelNames, modelSeeds, {
							...childData,
							[target]: resolvedData,
						})
					)
				)
				.flat()
		);
	}
	return data;
}

export async function seedModel<ModelName extends ModelNames>(
	target: ModelName,
	modelSeeds: ModelSeeds,
	childData: Partial<ResolverObject<ModelName>> = {}
): Promise<Awaited<SeededResolverReturn<ModelName>>[]> {
	const mockFunctions = modelSeeds[target];
	if (!mockFunctions) {
		throw new Error(`Missing seed-function for "${target}"`);
	}
	const functionArray: (SingleResolver<ModelName> | null)[] = Array.isArray(mockFunctions)
		? mockFunctions
		: [mockFunctions];

	let ret: PromiseLike<Awaited<SeededResolverReturn<ModelName>>[]>[] = [];

	for (const mockFunction of functionArray) {
		const neededModels = (Object.keys(modelRelations[target]) as ModelNames[]).filter(key => !(key in childData));

		const relatedData = (
			await Promise.all(
				neededModels.map(async model => {
					return {
						[model]: (await seedModel(model, modelSeeds)).at(0),
					};
				})
			)
		).reduce((obj, modelData) => {
			return {
				...obj,
				...modelData,
			};
		}, childData) as ResolverObject<ModelName>;

		if (mockFunction === null) {
			continue;
		}

		const queries = mockFunction(relatedData);
		let returnArray = Array.isArray(queries) ? queries : [queries];
		ret.push(
			Promise.all(returnArray).then(resolvedData => seedParentRelation(target, resolvedData, modelSeeds, childData))
		);
	}

	return Promise.all(ret).then(data => data.flat());
}

export async function seedDatabase(modelSeeds: ModelSeeds) {
	const keys = Object.keys(modelSeeds) as ModelNames[];
	for (const name of keys) {
		await seedModel(name, modelSeeds);
	}
}
