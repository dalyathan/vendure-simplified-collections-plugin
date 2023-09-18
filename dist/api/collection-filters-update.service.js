var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { TransactionalConnection, CollectionService, Collection, productIdCollectionFilter } from '@vendure/core';
import { In } from 'typeorm';
let ProductIdCollectionFilterUpdateService = class ProductIdCollectionFilterUpdateService {
    constructor(connections, collectionService) {
        this.connections = connections;
        this.collectionService = collectionService;
    }
    async handleExistingCollectionUpdated(ctx, productId, updatedIds) {
        const collectionRepo = this.connections.getRepository(ctx, Collection);
        const alreadyContainingCollectionsUpdateInputs = [];
        const newContainingCollectionsUpdateInputs = [];
        const existingCollectionsWithThisProduct = await collectionRepo.find({ where: {
                productVariants: { productId }
            } });
        const newCollectionsWithThisProduct = await collectionRepo.find({ where: {
                id: In(updatedIds.filter((i) => !existingCollectionsWithThisProduct.find((c) => c.id == i)))
            } });
        //if exists in existingCollectionsWithThisProduct but not in updatedIds, removed
        for (let collection of existingCollectionsWithThisProduct) {
            let input = {
                id: collection.id
            };
            let adjusted = [];
            if (!updatedIds.find((i) => i == collection.id)) {
                const thisCollectionsProductIdCollectionFilterIndex = collection.filters?.findIndex((f) => f.code === productIdCollectionFilter.code);
                const thisCollectionsProductIdCollectionFilter = collection.filters[thisCollectionsProductIdCollectionFilterIndex];
                if (thisCollectionsProductIdCollectionFilter?.args?.length) {
                    let productIdArgs = thisCollectionsProductIdCollectionFilter
                        .args.find((i) => i.name === "productIds");
                    if (productIdArgs) {
                        let ids = JSON.parse(productIdArgs.value).filter((i) => i != productId);
                        productIdArgs.value = JSON.stringify(ids);
                        thisCollectionsProductIdCollectionFilter.args[thisCollectionsProductIdCollectionFilterIndex] = {
                            name: productIdArgs.name,
                            value: productIdArgs.value
                        };
                        adjusted = [{
                                arguments: thisCollectionsProductIdCollectionFilter.args,
                                code: thisCollectionsProductIdCollectionFilter.code
                            }];
                        input.filters = adjusted;
                    }
                }
                alreadyContainingCollectionsUpdateInputs.push(input);
            }
        }
        for (let newCollection of newCollectionsWithThisProduct) {
            let input = {
                id: newCollection.id
            };
            let adjusted = [];
            const thisCollectionsProductIdCollectionFilterIndex = newCollection.filters?.findIndex((f) => f.code === productIdCollectionFilter.code);
            const thisCollectionsProductIdCollectionFilter = newCollection.filters[thisCollectionsProductIdCollectionFilterIndex];
            if (thisCollectionsProductIdCollectionFilter?.args?.length) {
                let productIdArgs = thisCollectionsProductIdCollectionFilter
                    .args.find((i) => i.name === "productIds");
                if (productIdArgs) {
                    let ids = JSON.parse(productIdArgs.value);
                    ids.push(productId);
                    productIdArgs.value = JSON.stringify(ids);
                    thisCollectionsProductIdCollectionFilter.args[thisCollectionsProductIdCollectionFilterIndex] = {
                        name: productIdArgs.name,
                        value: productIdArgs.value
                    };
                    adjusted = [{
                            arguments: thisCollectionsProductIdCollectionFilter.args,
                            code: thisCollectionsProductIdCollectionFilter.code
                        }];
                    input.filters = adjusted;
                }
                else {
                    let ids = [productId];
                    const newProductIdArgs = {
                        name: "productIds",
                        value: JSON.stringify(ids)
                    };
                    thisCollectionsProductIdCollectionFilter.args.push(newProductIdArgs);
                    thisCollectionsProductIdCollectionFilter.args.push({
                        name: "combineWithAnd",
                        value: "false"
                    });
                    adjusted = [{
                            arguments: thisCollectionsProductIdCollectionFilter.args,
                            code: thisCollectionsProductIdCollectionFilter.code
                        }];
                    input.filters = adjusted;
                }
            }
            else {
                let ids = [productId];
                const newProductIdArgs = {
                    name: "productIds",
                    value: JSON.stringify(ids)
                };
                if (thisCollectionsProductIdCollectionFilter) {
                    thisCollectionsProductIdCollectionFilter.args = [
                        newProductIdArgs,
                        {
                            name: "combineWithAnd",
                            value: "false"
                        }
                    ];
                    adjusted = [{
                            arguments: thisCollectionsProductIdCollectionFilter.args,
                            code: thisCollectionsProductIdCollectionFilter.code
                        }];
                    input.filters = adjusted;
                }
                else {
                    const newthisCollectionsProductIdCollectionFilter = {
                        args: [newProductIdArgs, {
                                name: "combineWithAnd",
                                value: "false"
                            }],
                        code: productIdCollectionFilter.code
                    };
                    adjusted = [{
                            arguments: newthisCollectionsProductIdCollectionFilter.args,
                            code: newthisCollectionsProductIdCollectionFilter.code
                        }];
                    input.filters = adjusted;
                }
            }
            newContainingCollectionsUpdateInputs.push(input);
        }
        const awaitAbleActions = [];
        for (let combined of [...newContainingCollectionsUpdateInputs, ...alreadyContainingCollectionsUpdateInputs]) {
            awaitAbleActions.push(this.collectionService.update(ctx, combined));
        }
        await Promise.all(awaitAbleActions);
    }
};
ProductIdCollectionFilterUpdateService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [TransactionalConnection,
        CollectionService])
], ProductIdCollectionFilterUpdateService);
export { ProductIdCollectionFilterUpdateService };
