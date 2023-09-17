import {  Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext, Product, Allow, Permission, Transaction, 
    Translated, ProductService } from '@vendure/core';
import { MutationCreateProductArgs, MutationUpdateProductArgs } from '../generated-admin-types';
import { Mutation,Args } from '@nestjs/graphql';
import { CollectionFiltersUpdateService } from './collection-filters-update.service';
@Resolver('Product')
export class ProductAdminOverrideResolver {
    constructor(
        private collectionFiltersUpdateService: CollectionFiltersUpdateService,
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
      const result= this.productService.create(ctx, input);
      const collectionIds= (input?.customFields as any)?.collections;
      result.then(async(p)=>{
        await this.collectionFiltersUpdateService.handleExistingCollectionUpdated(ctx,p.id as string,JSON.parse(collectionIds))
      })
      return this.productService.create(ctx, input);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog, Permission.UpdateProduct)
  async updateProduct(
      @Ctx() ctx: RequestContext,
      @Args() args: MutationUpdateProductArgs,
  ): Promise<Translated<Product>> {
      const { input } = args;
      const collectionIds= (input?.customFields as any)?.collections;
      await this.collectionFiltersUpdateService.handleExistingCollectionUpdated(ctx,input.id as string,JSON.parse(collectionIds))
      return await this.productService.update(ctx, input);
  }
}
