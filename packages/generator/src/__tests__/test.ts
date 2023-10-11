import { seedModel, downStreamSeed } from '../../../usage/prisma/modelSeeds';
import { mockers } from '../../../usage/prisma/mockers';
import { database } from '../../../usage/database';

async function test() {
	await database.userLog.deleteMany();
	await database.business.deleteMany();
	await database.businessSubscription.deleteMany();
	await database.user.deleteMany();

	const users = await downStreamSeed('User', mockers);
	console.log('Users', users);
}

test();
