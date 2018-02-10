import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NtkmeButtonModule } from '@ctrl/ngx-github-buttons';

import { EmojiModule } from '../lib/emoji/emoji.module';
import { PickerModule } from '../lib/picker/picker.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, PickerModule, EmojiModule, NtkmeButtonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
