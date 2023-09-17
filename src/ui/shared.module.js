"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedExtensionModule = void 0;
const core_1 = require("@angular/core");
const core_2 = require("@vendure/admin-ui/core");
const product_collection_custom_field_component_1 = require("./product-collection-custom-field.component");
let SharedExtensionModule = class SharedExtensionModule {
};
SharedExtensionModule = __decorate([
    (0, core_1.NgModule)({
        imports: [core_2.SharedModule],
        declarations: [product_collection_custom_field_component_1.ProductCollectionCustomFieldComponent],
        providers: [
            (0, core_2.registerFormInputComponent)('product-collections', product_collection_custom_field_component_1.ProductCollectionCustomFieldComponent),
        ]
    })
], SharedExtensionModule);
exports.SharedExtensionModule = SharedExtensionModule;
