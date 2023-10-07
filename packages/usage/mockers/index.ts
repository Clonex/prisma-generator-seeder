import { Mockers } from '../types/mockers';

export const mockers: Mockers = {
	TestChild: ({ TestParent }) => {
		return {
			title: 'Ranomized title',
			parentId: TestParent.id,
		};
	},
	TestParent: () => {
		return {
			title: 'Random title',
		};
	},
};
