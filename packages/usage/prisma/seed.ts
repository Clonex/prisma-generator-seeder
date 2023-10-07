import { mockers } from './mockers';
import { seedDatabase } from './modelSeeds';

seedDatabase(mockers).then(() => console.log('Seeded database'));
