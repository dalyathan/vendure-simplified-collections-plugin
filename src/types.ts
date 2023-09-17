import { Collection } from '@vendure/core';
import { CustomProductFields } from '@vendure/core/dist/entity/custom-entity-fields';

declare module '@vendure/core/dist/entity/custom-entity-fields' {
  interface CustomProductFields {
    collections: string;
  }
}