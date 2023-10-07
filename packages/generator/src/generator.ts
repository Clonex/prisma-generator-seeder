import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { GENERATOR_NAME } from './constants';
import { writeFileSafely } from './utils/writeFileSafely';
import { genRelations } from './helpers/genRelations';
import { getModelSeedTypes, getSeedTools } from './utils/getModelSeedTypes';

const { version } = require('../package.json');

generatorHandler({
	onManifest() {
		console.info(`${GENERATOR_NAME}:Registered`);
		return {
			version,
			defaultOutput: '../generated',
			prettyName: GENERATOR_NAME,
		};
	},
	onGenerate: async (options: GeneratorOptions) => {
		const relations = genRelations(options.dmmf);
		const [modelSeedTypes, seedTools] = await Promise.all([getModelSeedTypes(), getSeedTools()]);

		await writeFileSafely(
			options.generator.output?.value!,
			`${modelSeedTypes}
			${relations}
			${seedTools}`
		);
	},
});
