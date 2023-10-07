import { DMMF } from '@prisma/generator-helper';
import { getRelationSet } from '../utils/relations';

export const genRelations = (input: DMMF.Document) => {
	let ret = 'export type ModelRelations = {';

	for (const model of input.datamodel.models) {
		const relations = getRelationSet(model.fields);
		ret += `"${model.name}": ${JSON.stringify(relations)},`;
	}

	ret += '};';
	return ret;
};
