import { NgModule } from '@angular/core';

import { AnchorsComponent } from './anchors.component';
import { CategoryComponent } from './category.component';
import { PickerComponent } from './picker.component';
import { PreviewComponent } from './preview.component';
import { SearchComponent } from './search.component';
import { SkinComponent } from './skins.component';

const components = [
  PickerComponent,
  AnchorsComponent,
  CategoryComponent,
  SearchComponent,
  PreviewComponent,
  SkinComponent,
];

@NgModule({
  imports: components,
  exports: components,
})
export class PickerModule {}
