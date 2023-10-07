import { Mockers } from '../types/mocking';
import { faker } from '@faker-js/faker';
import { database } from '../database';

export const mockers: Mockers = {
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
