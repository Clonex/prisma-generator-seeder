import { PrismaClient } from '@prisma/client';
import { seedModel } from '../../../usage/prisma/modelSeeds';
import { mockers } from '../../../usage/prisma/mockers';

const database = new PrismaClient();

describe('seeding', () => {
	test('a single model', async () => {
		const users = await seedModel('User', mockers);
		console.log(users);

		expect(1).toStrictEqual({});
	});
});
