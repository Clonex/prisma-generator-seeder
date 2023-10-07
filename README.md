# prisma-generator-seeder

> This generator was bootstraped using
> [create-prisma-generator](https://github.com/YassinEldeeb/create-prisma-generator)

# Setup

1. Add the generator to your `schema.prisma` file.

```javascript
generator DatabaseSeeder {
  provider = "prisma-generator-seeder"
  output   = "."
}
```

2. Generate types

```sh
yarn prisma generate
```

3. Define how each prisma model should be mocked in your `seed.ts` file.

```javascript
import { seedDatabase, Mockers } from './mocking';
import { database } from '../../database';
import { faker } from '@faker-js/faker';

const mockers: Mockers = {
	Country: () => {
		return database.country.create({
			data: {
				name: faker.company.name(),
			},
		});
	},
	House: ({ Country }) => {
		return database.house.create({
			data: {
				address: faker.location.streetAddress(),
				countryId: Country.id,
			},
		});
	},
	Person: ({ Country, House }) => {
		return database.person.create({
			data: {
				fullName: faker.person.fullName(),
				countryId: Country.id,
				houseId: House.id,
			},
		});
	},
};

seedDatabase(mockers).then(() => console.log('Seeded database'));
```
