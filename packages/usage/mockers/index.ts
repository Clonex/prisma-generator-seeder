import { Mockers } from '../types/mockers';
import { database } from '../database';

export const mockers: Mockers = {
	TestChild: ({ TestParent }) => {
		return database.testChild.create({
			data: {
				title: 'Ranomized title',
				parentId: TestParent.id,
			},
		});
	},
	TestParent: () => {
		return database.testParent.create({
			data: {
				title: 'Random title',
			},
		});
	},
};
