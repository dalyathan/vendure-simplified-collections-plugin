import { TransactionalConnection, CollectionService, RequestContext } from '@vendure/core';
export declare class CollectionFiltersUpdateService {
    private connections;
    private collectionService;
    constructor(connections: TransactionalConnection, collectionService: CollectionService);
    handleExistingCollectionUpdated(ctx: RequestContext, productId: string, updatedIds: string[]): Promise<void>;
}
