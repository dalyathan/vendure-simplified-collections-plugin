import {  Component,OnInit,ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import {gql} from 'graphql-tag';
import {ActivatedRoute} from '@angular/router';
import { CustomFieldConfig, DataService, FormInputComponent, StringCustomFieldConfig } from '@vendure/admin-ui/core';
import { ID } from '@vendure/core';
@Component({
    template:  `
    <ng-select
        [multiple]="true"
        [(ngModel)]="options"
        appendTo="body"
        (change)="onChange($event)"
    >
        <ng-option *ngFor="let collection of allCollections" [value]="collection.id">
            {{ collection.name }}
        </ng-option>
    </ng-select>
    `
  })
  export class ProductCollectionCustomFieldComponent implements FormInputComponent<StringCustomFieldConfig>, OnInit {
    isListInput?: boolean | undefined;
    readonly!: boolean;
    formControl!: FormControl;
    config!: StringCustomFieldConfig;
    allCollections:{id: ID,name:string}[]=[];
    options:any[]=[]
    constructor(private dataService: DataService, 
      private cdr: ChangeDetectorRef,
      private activatedRoute: ActivatedRoute){
        // this.config= super.config;
        // this.readonly= this.config?.readonly;

    }
    ngOnInit(): void {
        this.dataService.query(gql`
          query AllCollections{
            collections{
              items{
                id
                name
              }
            }
          }
        `).single$.subscribe((data:any)=>{
          if(data?.collections?.items){
            this.allCollections=data?.collections?.items
            this.cdr.markForCheck();
          }
        })
        this.activatedRoute.params.subscribe((data)=>{
          const productId=data['id'];
          this.dataService.query(gql`
            query ProductCollections($id: ID!){
              product(id: $id){
                collections{
                  id
                }
              }
            }
          `,{id: productId}).single$.subscribe((data:any)=>{
            if(data?.product?.collections?.length){
              this.options=data?.product?.collections.map((i:any)=> i.id);
              this.cdr.markForCheck();
            }
          })
        })
    }
    onChange(event:any){
      this.formControl.setValue(JSON.stringify(this.options));
      this.formControl.markAsDirty();
    }
    
  }


