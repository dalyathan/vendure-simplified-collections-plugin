import {  Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext, Product, Allow, Permission, Transaction, 
    Translated, ProductService } from '@vendure/core';
import { MutationCreateProductArgs, MutationUpdateProductArgs } from '../ui/generated-admin-types';
import { Mutation,Args } from '@nestjs/graphql';
import { ProductIdCollectionFilterUpdateService } from './collection-filters-update.service';
@Resolver('Product')
export class ProductAdminOverrideResolver {
    constructor(
        private collectionFiltersUpdateService: ProductIdCollectionFilterUpdateService,
        private productService: ProductService,
    ){

    }

  @Transaction()
  @Mutation()
  @Allow(Permission.CreateCatalog, Permission.CreateProduct)
  async createProduct(
      @Ctx() ctx: RequestContext,
      @Args() args: MutationCreateProductArgs,
  ): Promise<Translated<Product>> {
      const { input } = args;
      const collectionIds= JSON.parse((input?.customFields as any)?.collections);
      (input?.customFields as any).collections='';
      const newlyCreatedProduct= await this.productService.create(ctx, input);
      await this.collectionFiltersUpdateService.handleExistingCollectionUpdated(ctx,newlyCreatedProduct.id as string,JSON.parse(collectionIds));
      return newlyCreatedProduct;
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog, Permission.UpdateProduct)
  async updateProduct(
      @Ctx() ctx: RequestContext,
      @Args() args: MutationUpdateProductArgs,
  ): Promise<Translated<Product>> {
      const { input } = args;
      const collectionIds= JSON.parse((input?.customFields as any)?.collections);
      (input?.customFields as any).collections='';
      await this.collectionFiltersUpdateService.handleExistingCollectionUpdated(ctx,input.id as string,collectionIds);
      return await this.productService.update(ctx, input);
  }
}
