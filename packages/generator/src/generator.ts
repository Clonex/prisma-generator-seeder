import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { GENERATOR_NAME } from './constants';
import { writeFileSafely } from './utils/writeFileSafely';
import { genRelations } from './helpers/genRelations';
import { getMockTypes, getSeedTools } from './utils/getMockerTypes';

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
		const [mockerTypes, seedTools] = await Promise.all([getMockTypes(), getSeedTools()]);

		await writeFileSafely(
			options.generator.output?.value!,
			`${mockerTypes}
			${relations}
			${seedTools}`
		);
	},
});
