import { ModelSeeds } from '../modelSeeds';
import { faker } from '@faker-js/faker';
import { database } from '../../database';

export const mockers: ModelSeeds = {
	User: () =>
		database.user.create({
			data: {
				name: faker.person.fullName(),
			},
		}),
	UserSubscription: [
		null,
		({ User }) =>
			database.userSubscription.create({
				data: {
					expireAt: new Date('0'), // Expired
					userId: User.id,
				},
			}),
		({ User }) =>
			database.userSubscription.create({
				data: {
					expireAt: new Date(Date.now() * 10), // Active
					userId: User.id,
				},
			}),
	],
	UserLog: ({ User }) => [
		database.userLog.create({
			data: {
				comment: faker.word.words(10),
				userId: User.id,
			},
		}),
		database.userLog.create({
			data: {
				comment: faker.word.words(10),
				userId: User.id,
			},
		}),
	],
};
