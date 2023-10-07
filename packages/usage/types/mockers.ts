import { ModelRelations } from './schema';
import { Prisma } from '@prisma/client';

export type Models = Prisma.TypeMap['model'];

export type ModelNames = keyof ModelRelations;

type ResolverObject<ModelName extends ModelNames> = {
	[Target in keyof ModelRelations[ModelName]]: ModelRelations[ModelName][Target] extends { to: string }
		? Record<ModelRelations[ModelName][Target]['to'], string>
		: unknown;
};

type Resolver<ModelName extends ModelNames> = (
	parents: ResolverObject<ModelName>
) => Models[ModelName]['operations']['create']['args']['data'];

export type Mockers = { [key in ModelNames]: Resolver<key> };
export type NullableMockers = { [key in ModelNames]?: Resolver<key> };
