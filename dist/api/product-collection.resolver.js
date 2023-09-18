var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext, Allow, Permission, Transaction, ProductService } from '@vendure/core';
import { Mutation, Args } from '@nestjs/graphql';
import { ProductIdCollectionFilterUpdateService } from './collection-filters-update.service';
let ProductAdminOverrideResolver = class ProductAdminOverrideResolver {
    constructor(collectionFiltersUpdateService, productService) {
        this.collectionFiltersUpdateService = collectionFiltersUpdateService;
        this.productService = productService;
    }
    async createProduct(ctx, args) {
        const { input } = args;
        const collectionIds = JSON.parse(input?.customFields?.collections);
        (input?.customFields).collections = '';
        const newlyCreatedProduct = await this.productService.create(ctx, input);
        await this.collectionFiltersUpdateService.handleExistingCollectionUpdated(ctx, newlyCreatedProduct.id, JSON.parse(collectionIds));
        return newlyCreatedProduct;
    }
    async updateProduct(ctx, args) {
        const { input } = args;
        const collectionIds = JSON.parse(input?.customFields?.collections);
        (input?.customFields).collections = '';
        await this.collectionFiltersUpdateService.handleExistingCollectionUpdated(ctx, input.id, collectionIds);
        return await this.productService.update(ctx, input);
    }
};
__decorate([
    Transaction(),
    Mutation(),
    Allow(Permission.CreateCatalog, Permission.CreateProduct),
    __param(0, Ctx()),
    __param(1, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ProductAdminOverrideResolver.prototype, "createProduct", null);
__decorate([
    Transaction(),
    Mutation(),
    Allow(Permission.UpdateCatalog, Permission.UpdateProduct),
    __param(0, Ctx()),
    __param(1, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ProductAdminOverrideResolver.prototype, "updateProduct", null);
ProductAdminOverrideResolver = __decorate([
    Resolver('Product'),
    __metadata("design:paramtypes", [ProductIdCollectionFilterUpdateService,
        ProductService])
], ProductAdminOverrideResolver);
export { ProductAdminOverrideResolver };
