import {  Component,OnInit,ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import {gql} from 'graphql-tag';
import {ActivatedRoute} from '@angular/router';
import { CustomFieldConfig, DataService, FormInputComponent } from '@vendure/admin-ui/core';
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
  export class ProductCollectionCustomFieldComponent implements FormInputComponent<CustomFieldConfig>, OnInit {
    isListInput?: boolean | undefined;
    readonly: boolean;
    formControl: FormControl;
    config: CustomFieldConfig;
    allCollections:any[]=[];
    options:any[]=[]
    id:string;
    constructor(private dataService: DataService, 
      private cdr: ChangeDetectorRef,
      private activatedRoute: ActivatedRoute){

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
          this.id=data['id'];
          this.dataService.query(gql`
            query ProductCollections($id: ID!){
              product(id: $id){
                collections{
                  id
                }
              }
            }
          `,{id: this.id}).single$.subscribe((data:any)=>{
            if(data?.product?.collections?.length){
              this.options=data?.product?.collections.map((i)=> i.id);
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


