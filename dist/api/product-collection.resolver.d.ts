import { RequestContext, Product, Translated, ProductService } from '@vendure/core';
import { MutationCreateProductArgs, MutationUpdateProductArgs } from '../generated-admin-types';
import { CollectionFiltersUpdateService } from './collection-filters-update.service';
export declare class ProductAdminOverrideResolver {
    private collectionFiltersUpdateService;
    private productService;
    constructor(collectionFiltersUpdateService: CollectionFiltersUpdateService, productService: ProductService);
    createProduct(ctx: RequestContext, args: MutationCreateProductArgs): Promise<Translated<Product>>;
    updateProduct(ctx: RequestContext, args: MutationUpdateProductArgs): Promise<Translated<Product>>;
}
