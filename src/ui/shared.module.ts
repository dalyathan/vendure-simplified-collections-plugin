import {  NgModule } from '@angular/core';
import { SharedModule,registerFormInputComponent } from '@vendure/admin-ui/core';
import { ProductCollectionCustomFieldComponent } from './product-collection-custom-field.component';
@NgModule({
    imports: [SharedModule],
    declarations: [ProductCollectionCustomFieldComponent],
    providers: [
      registerFormInputComponent('product-collections', ProductCollectionCustomFieldComponent),
    ]
  })
  export class SimplifiedCollectionsSharedExtensionModule {}