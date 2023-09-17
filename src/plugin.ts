import '../types';
import { LanguageCode, PluginCommonModule, VendurePlugin } from '@vendure/core';
import { AdminUiExtension } from '@vendure/ui-devkit/compiler';
import path from 'path';
import { CollectionFilterOverrideResolver } from './api/collection-filter-override.resolver';
import { ProductAdminOverrideResolver } from './api/product-collection.resolver';
import { CollectionFiltersUpdateService } from './api/collection-filters-update.service';
@VendurePlugin({
  imports:[PluginCommonModule],
  adminApiExtensions:{
    resolvers:[CollectionFilterOverrideResolver,ProductAdminOverrideResolver]
  },
  providers:[CollectionFiltersUpdateService],
  configuration: config => {
    config.customFields.Product.push({
        name: "collections",
        type: "text",
        defaultValue: "",
        ui: { component: "product-collections" },
        label: [{ languageCode: LanguageCode.en, value: "Collections" }],
      });
    return config;
  }
})
export class SimplifiedCollectionsPlugin {
    static uiExtensions: AdminUiExtension = {
        extensionPath: path.join(__dirname, 'ui'),
        ngModules: [
            {
                type: 'shared' as const,
                ngModuleFileName: 'shared.module.ts',
                ngModuleName: 'SharedExtensionModule',
            },
        ],
    };
}
