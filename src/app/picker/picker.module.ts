import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickerComponent } from './picker.component';
import { EmojiComponent } from './emoji.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PickerComponent, EmojiComponent],
})
export class PickerModule {}
