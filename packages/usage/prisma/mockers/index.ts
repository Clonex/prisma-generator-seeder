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
	Business: () =>
		database.business.create({
			data: {
				name: faker.company.name(),
			},
		}),
	BusinessSubscription: [
		null,
		({ User, Business }) =>
			database.businessSubscription.create({
				data: {
					expireAt: new Date('0'), // Expired
					userId: User.id,
					businessId: Business.id,
				},
			}),
		({ User, Business }) =>
			database.businessSubscription.create({
				data: {
					expireAt: new Date(Date.now() * 10), // Active
					userId: User.id,
					businessId: Business.id,
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
