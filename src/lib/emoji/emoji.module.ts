import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EmojiComponent } from './emoji.component';

@NgModule({
  imports: [CommonModule],
  exports: [EmojiComponent],
  declarations: [EmojiComponent],
  providers: [],
})
export class EmojiModule {}
