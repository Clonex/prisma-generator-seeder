import { seedModel } from '../../../usage/prisma/modelSeeds';
import { mockers } from '../../../usage/prisma/mockers';
import { database } from '../../../usage/database';

async function test() {
	await database.userLog.deleteMany();
	await database.userSubscription.deleteMany();
	await database.user.deleteMany();

	const users = await seedModel('User', mockers);
	console.log('Users', users);
}

test();
