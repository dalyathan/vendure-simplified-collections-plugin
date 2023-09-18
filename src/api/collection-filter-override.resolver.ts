import { Resolver,Query,Args } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext, productIdCollectionFilter } from '@vendure/core';
import { ConfigurableOperationDefinition, QueryCollectionsArgs } from '../ui/generated-admin-types';

@Resolver()
export class CollectionFilterOverrideResolver{
    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadCollection)
    async collectionFilters(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCollectionsArgs,
    ): Promise<ConfigurableOperationDefinition[]> {
        return [productIdCollectionFilter].map((i)=>i.toGraphQlType(ctx));
    }
}