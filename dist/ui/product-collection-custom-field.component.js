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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCollectionCustomFieldComponent = void 0;
const core_1 = require("@angular/core");
const graphql_tag_1 = require("graphql-tag");
const router_1 = require("@angular/router");
const core_2 = require("@vendure/admin-ui/core");
let ProductCollectionCustomFieldComponent = class ProductCollectionCustomFieldComponent {
    constructor(dataService, cdr, activatedRoute) {
        this.dataService = dataService;
        this.cdr = cdr;
        this.activatedRoute = activatedRoute;
        this.allCollections = [];
        this.options = [];
    }
    ngOnInit() {
        this.dataService.query((0, graphql_tag_1.gql) `
          query AllCollections{
            collections{
              items{
                id
                name
              }
            }
          }
        `).single$.subscribe((data) => {
            if (data?.collections?.items) {
                this.allCollections = data?.collections?.items;
                this.cdr.markForCheck();
            }
        });
        this.activatedRoute.params.subscribe((data) => {
            this.id = data['id'];
            console.log(this.id, " data['id']");
            this.dataService.query((0, graphql_tag_1.gql) `
            query ProductCollections($id: ID!){
              product(id: $id){
                collections{
                  id
                }
              }
            }
          `, { id: this.id }).single$.subscribe((data) => {
                if (data?.product?.collections?.length) {
                    this.options = data?.product?.collections.map((i) => i.id);
                    this.cdr.markForCheck();
                }
            });
        });
    }
    onChange(event) {
        this.formControl.setValue(JSON.stringify(this.options));
        this.formControl.markAsDirty();
    }
};
ProductCollectionCustomFieldComponent = __decorate([
    (0, core_1.Component)({
        template: `
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
    }),
    __metadata("design:paramtypes", [core_2.DataService,
        core_1.ChangeDetectorRef,
        router_1.ActivatedRoute])
], ProductCollectionCustomFieldComponent);
exports.ProductCollectionCustomFieldComponent = ProductCollectionCustomFieldComponent;
