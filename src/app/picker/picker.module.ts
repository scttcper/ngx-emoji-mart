import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickerComponent } from './picker.component';
import { EmojiComponent } from './emoji.component';
import { AnchorsComponent } from './anchors.component';
import { CategoryComponent } from './category.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PickerComponent, EmojiComponent, AnchorsComponent, CategoryComponent],
})
export class PickerModule {}
