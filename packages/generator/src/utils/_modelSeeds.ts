// @ts-nocheck

import { Prisma, PrismaPromise } from '@prisma/client';

export type Models = Prisma.TypeMap['model'];

export type ModelNames = keyof ModelRelations;

export type ResolverObject<ModelName extends ModelNames> = {
	[Target in keyof ModelRelations[ModelName]]: ModelRelations[ModelName][Target] extends { to: string }
		? Record<ModelRelations[ModelName][Target]['to'], string>
		: unknown;
};

export type Resolver<ModelName extends ModelNames> = (
	parents: ResolverObject<ModelName>
) => PrismaPromise<Models[ModelName]['operations']['create']['result']>;

export type ModelSeeds = { [ModelName in ModelNames]: Resolver<ModelName> };
export type NullableModelSeeds = { [ModelName in ModelNames]?: Resolver<ModelName> };
