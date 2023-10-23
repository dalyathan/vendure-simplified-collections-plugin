import {Injectable} from '@nestjs/common';
import {TransactionalConnection, CollectionService, RequestContext, Collection, productIdCollectionFilter } from '@vendure/core';
import { UpdateCollectionInput, ConfigurableOperationInput, ConfigArg, ConfigurableOperation } from '../ui/generated-admin-types';
import {In} from 'typeorm';
import normalizeId from '../helpers';
@Injectable()
export class ProductIdCollectionFilterUpdateService{

    constructor(
        private connections: TransactionalConnection,
        private collectionService: CollectionService){

    }
    async handleExistingCollectionUpdated(ctx: RequestContext,
        productId:string,updatedIds:string[]):Promise<void>{
            const collectionRepo= this.connections.getRepository(ctx, Collection);
            const alreadyContainingCollectionsUpdateInputs:UpdateCollectionInput[]=[];
            const newContainingCollectionsUpdateInputs:UpdateCollectionInput[]=[];
            const existingCollectionsWithThisProduct= await collectionRepo.find({where:{
                productVariants:{productId}
            }})
            const newCollectionsWithThisProduct= await collectionRepo.find({where:{
                id: In(updatedIds.filter((i)=> !existingCollectionsWithThisProduct.find((c)=> c.id == i)).map((i)=> normalizeId(i)))
            }})
            //if exists in existingCollectionsWithThisProduct but not in updatedIds, removed
            for(let collection of existingCollectionsWithThisProduct){
                let input:UpdateCollectionInput={
                    id: collection.id
                };
                let adjusted:ConfigurableOperationInput[]=[];
                if(!updatedIds.find((i)=> i == collection.id)){
                    const thisCollectionsProductIdCollectionFilterIndex= collection.filters?.findIndex((f)=> f.code === productIdCollectionFilter.code);
                    const thisCollectionsProductIdCollectionFilter= collection.filters[thisCollectionsProductIdCollectionFilterIndex];
                    if(thisCollectionsProductIdCollectionFilter?.args?.length){
                        let productIdArgs=thisCollectionsProductIdCollectionFilter
                        .args.find((i)=> i.name === "productIds");
                        if(productIdArgs){
                            let ids= (JSON.parse(productIdArgs.value) as any[]).filter((i:any)=> i!= productId);
                            productIdArgs.value= JSON.stringify(ids);
                            thisCollectionsProductIdCollectionFilter.args[thisCollectionsProductIdCollectionFilterIndex]={
                                name: productIdArgs.name,
                                value:productIdArgs.value
                            }
                            adjusted=[{
                                arguments: thisCollectionsProductIdCollectionFilter.args,
                                code: thisCollectionsProductIdCollectionFilter.code
                            }]
                            input.filters=adjusted;
                        }
                    }
                    alreadyContainingCollectionsUpdateInputs.push(input);
                }
            }
            for(let newCollection of newCollectionsWithThisProduct){
                let input:UpdateCollectionInput={
                    id: newCollection.id
                };
                let adjusted:ConfigurableOperationInput[]=[];
                const thisCollectionsProductIdCollectionFilterIndex= newCollection.filters?.findIndex((f)=> f.code === productIdCollectionFilter.code);
                    const thisCollectionsProductIdCollectionFilter= newCollection.filters[thisCollectionsProductIdCollectionFilterIndex];
                    
                if(thisCollectionsProductIdCollectionFilter?.args?.length){
                    let productIdArgs=thisCollectionsProductIdCollectionFilter
                        .args.find((i)=> i.name === "productIds");
                        if(productIdArgs){
                            let ids= JSON.parse(productIdArgs.value);
                            ids.push(productId);
                            productIdArgs.value= JSON.stringify(ids);
                            thisCollectionsProductIdCollectionFilter.args[thisCollectionsProductIdCollectionFilterIndex]={
                                name: productIdArgs.name,
                                value:productIdArgs.value
                            }
                            adjusted=[{
                                arguments: thisCollectionsProductIdCollectionFilter.args,
                                code: thisCollectionsProductIdCollectionFilter.code
                            }]
                            input.filters=adjusted;
                        }else{
                            let ids= [productId];
                            const newProductIdArgs:ConfigArg= {
                                name: "productIds",
                                value:JSON.stringify(ids)
                            };
                            thisCollectionsProductIdCollectionFilter.args.push(newProductIdArgs);
                            thisCollectionsProductIdCollectionFilter.args.push(
                                {
                                    name: "combineWithAnd",
                                    value: "false"
                                  }
                            )
                            adjusted=[{
                                arguments: thisCollectionsProductIdCollectionFilter.args,
                                code: thisCollectionsProductIdCollectionFilter.code
                            }]
                            input.filters=adjusted;
                        }
                }else{
                    let ids= [productId];
                    const newProductIdArgs:ConfigArg= {
                        name: "productIds",
                        value:JSON.stringify(ids)
                    };
                    if(thisCollectionsProductIdCollectionFilter){
                        thisCollectionsProductIdCollectionFilter.args=[
                            newProductIdArgs,
                            {
                                name: "combineWithAnd",
                                value: "false"
                            }
                        ]
                        adjusted=[{
                            arguments: thisCollectionsProductIdCollectionFilter.args,
                            code: thisCollectionsProductIdCollectionFilter.code
                        }]
                        input.filters=adjusted;
                    }else{
                        const newthisCollectionsProductIdCollectionFilter:ConfigurableOperation={
                            args: [newProductIdArgs, {
                                name: "combineWithAnd",
                                value: "false"
                              }],
                            code:  productIdCollectionFilter.code
                        }
                        console.log(newthisCollectionsProductIdCollectionFilter,'--------newthisCollectionsProductIdCollectionFilter---')
                        adjusted=[{
                            arguments: newthisCollectionsProductIdCollectionFilter.args,
                            code: newthisCollectionsProductIdCollectionFilter.code
                        }]
                        input.filters=adjusted;
                    }
                }
                newContainingCollectionsUpdateInputs.push(input);
            }
            const awaitAbleActions:Promise<unknown>[]=[];
            for(let combined of [...newContainingCollectionsUpdateInputs,...alreadyContainingCollectionsUpdateInputs]){
                awaitAbleActions.push(this.collectionService.update(ctx, combined));
            }
            await Promise.all(awaitAbleActions);
        }
}