import { getRelationSet } from '../utils/relations';
import { getSampleDMMF } from './__fixtures__/getSampleDMMF';

test('relation set', async () => {
	const sampleDMMF = await getSampleDMMF();

	sampleDMMF.datamodel.models.forEach(model => {
		const relationSet = getRelationSet(model.fields);
		expect(relationSet).toStrictEqual({});
	});
});
