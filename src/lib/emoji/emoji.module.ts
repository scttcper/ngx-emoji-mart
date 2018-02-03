import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EmojiComponent } from './emoji.component';
import { EmojiService } from './emoji.service';

@NgModule({
  imports: [CommonModule],
  exports: [EmojiComponent],
  declarations: [EmojiComponent],
  providers: [EmojiService],
})
export class EmojiModule {}
