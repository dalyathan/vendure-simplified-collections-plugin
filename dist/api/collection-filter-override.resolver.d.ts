import { RequestContext } from '@vendure/core';
import { ConfigurableOperationDefinition, QueryCollectionsArgs } from '../generated-shop-types';
export declare class CollectionFilterOverrideResolver {
    collectionFilters(ctx: RequestContext, args: QueryCollectionsArgs): Promise<ConfigurableOperationDefinition[]>;
}
