# prisma-generator-seeder

Automaticly seeds your database with dummy data.

It will automaticly create each model, and the relations required for it.

```sh
yarn add prisma-generator-seeder
```

> This generator was bootstraped using
> [create-prisma-generator](https://github.com/YassinEldeeb/create-prisma-generator)

# Generated files

| Export                                               | Description                                                |
| ---------------------------------------------------- | ---------------------------------------------------------- |
| seedModel(target: ModelName, modelSeeds: ModelSeeds) | Automaticly creates the given model, and its relations.    |
| seedDatabase(modelSeeds: ModelSeeds)                 | Automaticly seeds all models for the whole schema.         |
| ModelSeeds                                           | Type for the object that defines how to create each model. |
| NullableModelSeeds                                   | Similar to ModelSeeds, but no model is required.           |

# Setup

1. Add the generator to your `schema.prisma` file.

```javascript
generator DatabaseSeeder {
  provider = "prisma-generator-seeder"
  output   = "./seeding.ts" // Path for the genereated types, relative to your prisma.schema.
}
```

2. Generate types

```sh
yarn prisma generate
```

3. Define how each prisma model should be seeded in your `seed.ts` file.

```javascript
import { seedDatabase, ModelSeeds } from './seeding';
import { database } from '../../database';
import { faker } from '@faker-js/faker';

const mockers: ModelSeeds = {
	User: () =>
		database.user.create({
			data: {
				name: faker.person.fullName(),
			},
		}),
	BusinessSubscription: [
		null,
		({ User }) =>
			database.businessSubscription.create({
				data: {
					expireAt: new Date('0'), // Expired
					userId: User.id,
				},
			}),
		({ User }) =>
			database.businessSubscription.create({
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

seedDatabase(modelSeeds).then(() => console.log('Seeded database'));
```

## Known issues

- It will create models that are not used. Currently the goal is to ensure that all models and relations are generated,
  without considering unnecessary model.
