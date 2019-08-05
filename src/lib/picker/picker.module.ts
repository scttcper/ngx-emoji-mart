import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { AnchorsComponent } from './anchors.component';
import { CategoryComponent } from './category.component';
import { PickerComponent } from './picker.component';
import { PreviewComponent } from './preview.component';
import { SearchComponent } from './search.component';
import { SkinComponent } from './skins.component';

@NgModule({
  imports: [CommonModule, FormsModule, EmojiModule],
  exports: [
    PickerComponent,
    AnchorsComponent,
    CategoryComponent,
    SearchComponent,
    PreviewComponent,
    SkinComponent,
  ],
  declarations: [
    PickerComponent,
    AnchorsComponent,
    CategoryComponent,
    SearchComponent,
    PreviewComponent,
    SkinComponent,
  ],
})
export class PickerModule {}
