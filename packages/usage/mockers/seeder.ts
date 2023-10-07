import { mockers } from '.';
import { ModelNames, Resolver, ResolverObject } from '../types/mockers';
import { modelRelations } from '../types/schema';

async function mockData<ModelName extends ModelNames>(target: ModelName): Promise<Resolver<ModelName>> {
	const mockFunction = mockers[target];
	if (!mockFunction) {
		throw new Error(`Missing mocker for "${target}"`);
	}

	const neededModels = Object.keys(modelRelations[target]) as ModelNames[];

	const relatedData = (
		await Promise.all(
			neededModels.map(async model => {
				return {
					[model]: await mockData(model),
				};
			})
		)
	).reduce((obj, modelData) => {
		return {
			...obj,
			...modelData,
		};
	}, {}) as ResolverObject<ModelName>;

	console.log(mockFunction, relatedData);

	const object = await mockFunction(relatedData);

	return object as Resolver<ModelName>;
}

async function test() {
	const keys = Object.keys(mockers) as ModelNames[];
	for (const name of keys) {
		const data = await mockData(name);
		console.log('Mocked', name);
	}
}

test();
