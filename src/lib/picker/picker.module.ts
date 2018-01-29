import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EmojiModule } from '../emoji/emoji.module';
import { AnchorsComponent } from './anchors.component';
import { CategoryComponent } from './category.component';
import { PickerComponent } from './picker.component';
import { PreviewComponent } from './preview.component';
import { SearchComponent } from './search.component';

const components: any[] = [
  PickerComponent,
  AnchorsComponent,
  CategoryComponent,
  SearchComponent,
  PreviewComponent,
];

@NgModule({
  imports: [CommonModule, FormsModule, EmojiModule],
  exports: components,
  declarations: components,
})
export class PickerModule {}
