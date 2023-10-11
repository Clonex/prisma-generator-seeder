// @ts-nocheck
// _seed.ts
function ensureArray<T>(element: T | T[]) {
	return Array.isArray(element) ? element : [element];
}

function firstElement<T>(element: T | T[]) {
	return Array.isArray(element) ? element.at(0) : element;
}

type Refs = Partial<{ [key in ModelNames]: Models[key]['operations']['create']['result'] }>;

// Only traverses down the tree
export async function downStreamSeed<ModelName extends ModelNames>(
	node: ModelName,
	modelSeeds: ModelSeeds,
	refs: Refs = {}
) {
	const mockFunctions = modelSeeds[node];
	if (!mockFunctions) {
		throw new Error(`Missing seed-function for "${node}"`);
	}
	const functionArray: (SingleResolver<ModelName> | null)[] = ensureArray(mockFunctions);

	let ret: PromiseLike<Awaited<SeededResolverReturn<ModelName>>[]>[] = [];

	for (const seedModelFunc of functionArray) {
		const neededModels = (Object.keys(modelRelations[node]) as ModelNames[]).filter(key => !(key in refs));
		// const modelData = (
		// 	await Promise.all(
		// 		neededModels.map(async model => {
		// 			return {
		// 				[model]: firstElement(await seedModel(model, modelSeeds)), //TODO: Throws away other cases??
		// 			};
		// 		})
		// 	)
		// ).reduce((obj, modelData) => {
		// 	return {
		// 		...obj,
		// 		...modelData,
		// 	};
		// }, refs) as ResolverObject<ModelName>;

		const modelData = (
			await Promise.all(
				neededModels.map(async model => {
					return {
						[model]: firstElement(await seedModel(model, modelSeeds)), //TODO: Throws away other cases??
					};
				})
			)
		).reduce((obj, modelData) => {
			return {
				...obj,
				...modelData,
			};
		}, refs) as ResolverObject<ModelName>;

		if (seedModelFunc === null) {
			continue;
		}
		// const modelData = refs as ResolverObject<ModelName>; // TODO: Fix!

		const temp = seedModelFunc(modelData);
		const newModelDataElements = ensureArray(temp);

		for (const newModelData of newModelDataElements) {
			const testData = firstElement(await newModelData);

			const children = modelRelationsRevereLookup[node];
			// console.log('traverseChildren', { node, children, refs });
			refs = {
				...refs,
				[node]: testData,
			};

			for (const child of children) {
				const name = child as ModelNames;
				if (!refs[name]) {
					console.log('Create', { from: node, to: name });
					await downStreamSeed(name, modelSeeds, refs);
				}
			}
		}

		refs = {};
	}
}

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
	refs: Refs = {}
): Promise<Awaited<SeededResolverReturn<ModelName>>[]> {
	const mockFunctions = modelSeeds[target];
	if (!mockFunctions) {
		throw new Error(`Missing seed-function for "${target}"`);
	}
	const functionArray: (SingleResolver<ModelName> | null)[] = ensureArray(mockFunctions);

	let ret: PromiseLike<Awaited<SeededResolverReturn<ModelName>>[]>[] = [];

	for (const mockFunction of functionArray) {
		const neededModels = (Object.keys(modelRelations[target]) as ModelNames[]).filter(key => !(key in refs));

		const modelData = (
			await Promise.all(
				neededModels.map(async model => {
					return {
						[model]: firstElement(await seedModel(model, modelSeeds)), //TODO: Throws away other cases??
					};
				})
			)
		).reduce((obj, modelData) => {
			return {
				...obj,
				...modelData,
			};
		}, refs) as ResolverObject<ModelName>;

		if (mockFunction === null) {
			continue;
		}

		const queries = mockFunction(modelData);
		let returnArray = Array.isArray(queries) ? queries : [queries];
		ret.push(Promise.all(returnArray));

		refs = {};
	}

	return Promise.all(ret).then(data => data.flat());
}

export async function seedDatabase(modelSeeds: ModelSeeds) {
	const keys = Object.keys(modelSeeds) as ModelNames[];
	for (const name of keys) {
		await seedModel(name, modelSeeds);
	}
}
