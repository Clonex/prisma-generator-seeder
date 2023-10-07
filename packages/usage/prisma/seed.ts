import { mockers } from './mockers';
import { seedDatabase } from './mocking';

seedDatabase(mockers).then(() => console.log('Seeded database'));
