import { RequestContext } from '@vendure/core';
import { ConfigurableOperationDefinition, QueryCollectionsArgs } from '../ui/generated-admin-types';
export declare class CollectionFilterOverrideResolver {
    collectionFilters(ctx: RequestContext, args: QueryCollectionsArgs): Promise<ConfigurableOperationDefinition[]>;
}
