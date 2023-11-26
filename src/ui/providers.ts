import {
    registerFormInputComponent
  } from '@vendure/admin-ui/core';
import { ProductCollectionCustomFieldComponent } from './product-collection-custom-field.component';
export default [
    registerFormInputComponent('product-collections', ProductCollectionCustomFieldComponent),
]