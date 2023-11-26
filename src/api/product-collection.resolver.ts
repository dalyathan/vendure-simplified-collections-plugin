
import { MutationCreateProductArgs, MutationUpdateProductArgs } from '../ui/generated-admin-types';

import { Resolver, Mutation, Args } from "@nestjs/graphql";
import {
  Ctx,
  RequestContext,
  Product,
  Allow,
  Permission,
  Transaction,
  Translated,
  ProductService,
  ProductVariantService,
  FacetValueService,
} from "@vendure/core";
import { ProductResolver } from "@vendure/core/dist/api/resolvers/admin/product.resolver";
import { ProductIdCollectionFilterUpdateService } from "./collection-filters-update.service";
@Resolver("Product")
export class ProductAdminOverrideResolver extends ProductResolver {
  constructor(
    private readonly collectionFiltersUpdateService: ProductIdCollectionFilterUpdateService,
    productService: ProductService,
    productVariantService: ProductVariantService,
    facetValueService: FacetValueService
  ) {
    super(productService, productVariantService, facetValueService);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.CreateCatalog, Permission.CreateProduct)
  async createProduct(
    @Ctx() ctx: RequestContext,
    @Args() args: MutationCreateProductArgs
  ): Promise<Translated<Product>> {
    const { input } = args;
    let collectionIds:string[]=[];
    if((input?.customFields as any)?.collections?.length){
        collectionIds=[...((input?.customFields as any).collections as string[])];
        (input?.customFields as any).collections = [];
    }
    const newlyCreatedProduct = await super.createProduct(ctx, args);
    if (collectionIds?.length) {
      await this.collectionFiltersUpdateService.handleExistingCollectionUpdated(
        ctx,
        newlyCreatedProduct.id as string,
        collectionIds
      );
    }
    return newlyCreatedProduct;
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog, Permission.UpdateProduct)
  async updateProduct(
    @Ctx() ctx: RequestContext,
    @Args() args: MutationUpdateProductArgs
  ): Promise<Translated<Product>> {
    const { input } = args;
    let collectionIds:string[]=[];
    if((input?.customFields as any)?.collections?.length){
        collectionIds=[...((input?.customFields as any).collections as string[])];
        (input?.customFields as any).collections = [];
    }
    if (collectionIds?.length) {
      await this.collectionFiltersUpdateService.handleExistingCollectionUpdated(
        ctx,
        input.id as string,
        collectionIds
      );
    }
    return await super.updateProduct(ctx, args);
  }
}
