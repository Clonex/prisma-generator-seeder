import { readFile } from 'fs/promises';
import { join } from 'path';

const utilsPath = join(__dirname, '../../src/utils/');

export const getModelSeedTypes = async () => {
	const data = await readFile(join(utilsPath, '_modelSeeds.ts'), { encoding: 'utf-8' });

	return data.split('\n').splice(1).join('\n');
};

export const getSeedTools = async () => {
	const data = await readFile(join(utilsPath, '_seed.ts'), { encoding: 'utf-8' });

	return data.split('\n').splice(1).join('\n');
};
