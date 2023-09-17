"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplifiedCollectionsPlugin = void 0;
require("./types");
const core_1 = require("@vendure/core");
const path_1 = __importDefault(require("path"));
const collection_filter_override_resolver_1 = require("./api/collection-filter-override.resolver");
const product_collection_resolver_1 = require("./api/product-collection.resolver");
const collection_filters_update_service_1 = require("./api/collection-filters-update.service");
let SimplifiedCollectionsPlugin = class SimplifiedCollectionsPlugin {
};
SimplifiedCollectionsPlugin.uiExtensions = {
    extensionPath: path_1.default.join(__dirname, 'ui'),
    ngModules: [
        {
            type: 'shared',
            ngModuleFileName: 'shared.module.ts',
            ngModuleName: 'SharedExtensionModule',
        },
    ],
};
SimplifiedCollectionsPlugin = __decorate([
    (0, core_1.VendurePlugin)({
        imports: [core_1.PluginCommonModule],
        adminApiExtensions: {
            resolvers: [collection_filter_override_resolver_1.CollectionFilterOverrideResolver, product_collection_resolver_1.ProductAdminOverrideResolver]
        },
        providers: [collection_filters_update_service_1.CollectionFiltersUpdateService],
        configuration: config => {
            config.customFields.Product.push({
                name: "collections",
                type: "text",
                defaultValue: "",
                ui: { component: "product-collections" },
                label: [{ languageCode: core_1.LanguageCode.en, value: "Collections" }],
            });
            return config;
        }
    })
], SimplifiedCollectionsPlugin);
exports.SimplifiedCollectionsPlugin = SimplifiedCollectionsPlugin;
