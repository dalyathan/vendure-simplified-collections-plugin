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
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext, productIdCollectionFilter } from '@vendure/core';
let CollectionFilterOverrideResolver = class CollectionFilterOverrideResolver {
    async collectionFilters(ctx, args) {
        return [productIdCollectionFilter].map((i) => i.toGraphQlType(ctx));
    }
};
__decorate([
    Query(),
    Allow(Permission.ReadCatalog, Permission.ReadCollection),
    __param(0, Ctx()),
    __param(1, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CollectionFilterOverrideResolver.prototype, "collectionFilters", null);
CollectionFilterOverrideResolver = __decorate([
    Resolver()
], CollectionFilterOverrideResolver);
export { CollectionFilterOverrideResolver };
