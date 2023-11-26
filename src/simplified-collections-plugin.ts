import { LanguageCode, PluginCommonModule, VendurePlugin,productIdCollectionFilter } from '@vendure/core';
import path from 'path';
import { ProductAdminOverrideResolver } from './api/product-collection.resolver';
import { ProductIdCollectionFilterUpdateService } from './api/collection-filters-update.service';
@VendurePlugin({
  imports:[PluginCommonModule],
  adminApiExtensions:{
    resolvers:[ProductAdminOverrideResolver]
  },
  providers:[ProductIdCollectionFilterUpdateService],
  configuration: config => {
    config.catalogOptions.collectionFilters=[productIdCollectionFilter]
    config.customFields.Product.push({
        name: "collections",
        type: "string",
        list: true,
        nullable: true,
        ui: { component: "product-collections" },
        label: [
            { languageCode: LanguageCode.en, value: "Collections" },
            {languageCode: LanguageCode.pl, value: 'Kolekcje'},
            { languageCode: LanguageCode.it, value: "Collezioni" },
            {languageCode: LanguageCode.de, value: 'Sammlungen'},
            { languageCode: LanguageCode.es, value: "Colecciones" },
            {languageCode: LanguageCode.ar, value: 'مجموعات'},
            { languageCode: LanguageCode.pt_BR, value: "Categorias" },
            {languageCode: LanguageCode.he, value: "םיפסוא"},
            { languageCode: LanguageCode.uk, value: "Колекції" },
            {languageCode: LanguageCode.zh_Hans, value: '商品系列'},
            { languageCode: LanguageCode.ru, value: "Коллекции" },
            {languageCode: LanguageCode.cs, value: "Kolekce"},
            { languageCode: LanguageCode.pt_PT, value: "Categorias" },
            {languageCode: LanguageCode.zh_Hant, value: '商品系列'},
      ],
    });
    return config;
  }
})
export class SimplifiedCollectionsPlugin {
    static uiExtensions = {
        extensionPath: path.join(__dirname, 'ui'),
        providers: ['providers.ts'],
    };
}
