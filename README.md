# Vendure Simplified  Collections Plugin
This `vendure` plugin allows you to maintain a two way relation between products and collections. `Vendure` by default only allows you to manage relations between your inventory and collections from the side of collections only. It complements this feature by giving you a variety of ways to manage the inventory contents of your collections through `CollectionFilters`(there are 4 types by default, but like everything in vendure, you can add more). Once you integrate this plugin into your vendure store, you will only be able to use the `productIdCollectionFilter` in the collections detail page. You can add this into an existing `vendure` store without affecting your existing collections' inventory collections.
## Getting started
Add the plugin to your config:
```ts
import { ProductCollectionPlugin } from '../src/plugin';
import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
plugins: [
      ...
      ProductCollectionPlugin,
      AdminUiPlugin.init({
        ...
        app: compileUiExtensions({
          ...
          extensions: [ProductCollectionPlugin.uiExtensions],
          ...
        }),
      }),
      ...
    ]
```
Then run db migrations.
```console
yarn migration:generate product-collections
yarn migartion run
```
## Product Detail Page

![product-page](https://github.com/dalyathan/vendure-simplified-collections-plugin/assets/39517388/d7e5ac1a-a70e-4375-8371-92c00dea48b4)
## Collection Detail Page

![collection-page](https://github.com/dalyathan/vendure-simplified-collections-plugin/assets/39517388/17cb2ab9-fb8c-4786-b1a3-50b292abc65d)
