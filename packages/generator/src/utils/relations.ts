import { DMMF } from '@prisma/generator-helper';

export function getRelationSet(fields: DMMF.Model['fields']) {
	return fields.reduce<{
		[type: string]: { to: string; from: string };
	}>((relations, curr) => {
		curr.relationFromFields?.forEach((from, i) => {
			const to = curr.relationToFields?.[i];
			if (to) {
				relations[curr.type] = { to, from };
			}
		});
		return relations;
	}, {});
}

export function getReversedRelationSet(name: DMMF.Model['name'], models: DMMF.Model[]) {
	return models.reduce<string[]>((arr, model) => {
		if (model.fields.some(field => field.type === name)) {
			arr.push(model.name);
		}

		return arr;
	}, []);
}
