import { RequestContext, Product, Translated, ProductService } from '@vendure/core';
import { MutationCreateProductArgs, MutationUpdateProductArgs } from '../ui/generated-admin-types';
import { ProductIdCollectionFilterUpdateService } from './collection-filters-update.service';
export declare class ProductAdminOverrideResolver {
    private collectionFiltersUpdateService;
    private productService;
    constructor(collectionFiltersUpdateService: ProductIdCollectionFilterUpdateService, productService: ProductService);
    createProduct(ctx: RequestContext, args: MutationCreateProductArgs): Promise<Translated<Product>>;
    updateProduct(ctx: RequestContext, args: MutationUpdateProductArgs): Promise<Translated<Product>>;
}
