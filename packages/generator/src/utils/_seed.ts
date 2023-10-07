// @ts-nocheck

export async function mockData<ModelName extends ModelNames>(
	target: ModelName,
	modelSeeds: ModelSeeds
): Promise<Resolver<ModelName>> {
	const mockFunction = modelSeeds[target];
	if (!mockFunction) {
		throw new Error(`Missing mocker for "${target}"`);
	}

	const neededModels = Object.keys(modelRelations[target]) as ModelNames[];

	const relatedData = (
		await Promise.all(
			neededModels.map(async model => {
				return {
					[model]: await mockData(model, modelSeeds),
				};
			})
		)
	).reduce((obj, modelData) => {
		return {
			...obj,
			...modelData,
		};
	}, {}) as ResolverObject<ModelName>;

	const object = await mockFunction(relatedData);

	return object as Resolver<ModelName>;
}

export async function seedDatabase(modelSeeds: ModelSeeds) {
	const keys = Object.keys(modelSeeds) as ModelNames[];
	for (const name of keys) {
		await mockData(name, modelSeeds);
	}
}
