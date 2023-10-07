import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import path from 'path';
import { GENERATOR_NAME } from './constants';
import { writeFileSafely } from './utils/writeFileSafely';
import { genRelations } from './helpers/genRelations';

const { version } = require('../package.json');

generatorHandler({
	onManifest() {
		console.info(`${GENERATOR_NAME}:Registered`);
		console.log('Hello?');
		return {
			version,
			defaultOutput: '../generated',
			prettyName: GENERATOR_NAME,
		};
	},
	onGenerate: async (options: GeneratorOptions) => {
		const relations = genRelations(options.dmmf);
		const writeLocation = path.join(options.generator.output?.value!, `schema.ts`);

		await writeFileSafely(writeLocation, relations);
	},
});
