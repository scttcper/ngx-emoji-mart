import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MdoButtonModule } from '@ctrl/ngx-github-buttons';

import { EmojiModule } from '../lib/emoji/emoji.module';
import { PickerModule } from '../lib/picker/picker.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer.component';

@NgModule({
  declarations: [AppComponent, FooterComponent],
  imports: [
    BrowserModule,
    CommonModule,
    PickerModule,
    EmojiModule,
    MdoButtonModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
