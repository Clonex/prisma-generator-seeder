// @ts-nocheck

// _modelSeeds.ts
import { Prisma } from '@prisma/client';

export type Models = Prisma.TypeMap['model'];

type MaybeArray<T> = T[] | T;

export type ModelNames = keyof ModelRelations;

export type ResolverObject<ModelName extends ModelNames> = {
	[Target in keyof ModelRelations[ModelName]]: ModelRelations[ModelName][Target] extends { to: string }
		? Record<ModelRelations[ModelName][Target]['to'], string>
		: unknown;
};

type SeededResolverReturn<ModelName extends ModelNames> = PromiseLike<
	Models[ModelName]['operations']['create']['result']
>;

export type SingleResolver<ModelName extends ModelNames> = (
	parents: ResolverObject<ModelName>
) => MaybeArray<SeededResolverReturn<ModelName>>;
export type Resolver<ModelName extends ModelNames> = MaybeArray<SingleResolver<ModelName>>;

export type ModelSeeds = { [ModelName in ModelNames]: Resolver<ModelName> };
export type NullableModelSeeds = { [ModelName in ModelNames]?: Resolver<ModelName> };
