"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAdminOverrideResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const core_1 = require("@vendure/core");
const graphql_2 = require("@nestjs/graphql");
const collection_filters_update_service_1 = require("./collection-filters-update.service");
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
    (0, core_1.Transaction)(),
    (0, graphql_2.Mutation)(),
    (0, core_1.Allow)(core_1.Permission.CreateCatalog, core_1.Permission.CreateProduct),
    __param(0, (0, core_1.Ctx)()),
    __param(1, (0, graphql_2.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ProductAdminOverrideResolver.prototype, "createProduct", null);
__decorate([
    (0, core_1.Transaction)(),
    (0, graphql_2.Mutation)(),
    (0, core_1.Allow)(core_1.Permission.UpdateCatalog, core_1.Permission.UpdateProduct),
    __param(0, (0, core_1.Ctx)()),
    __param(1, (0, graphql_2.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ProductAdminOverrideResolver.prototype, "updateProduct", null);
ProductAdminOverrideResolver = __decorate([
    (0, graphql_1.Resolver)('Product'),
    __metadata("design:paramtypes", [collection_filters_update_service_1.ProductIdCollectionFilterUpdateService,
        core_1.ProductService])
], ProductAdminOverrideResolver);
exports.ProductAdminOverrideResolver = ProductAdminOverrideResolver;
