import { mockers } from '.';
import { ModelNames } from '../types/mockers';

async function mockData(target: ModelNames) {
	const mockFunction = mockers[target];
	if (!mockFunction) {
		throw new Error(`Missing mocker for "${target}"`);
	}

	console.log(mockFunction);
}

async function test() {
	const keys = Object.keys(mockers) as ModelNames[];
	for (const name of keys) {
		const data = await mockData(name);
		console.log('Mockit??', data);
	}
}

test();
