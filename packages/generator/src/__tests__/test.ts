import { seedModel } from '../../../usage/prisma/modelSeeds';
import { mockers } from '../../../usage/prisma/mockers';

async function test() {
	const users = await seedModel('User', mockers);
	console.log(users);
}

test();
