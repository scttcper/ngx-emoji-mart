import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GhButtonModule } from '@ctrl/ngx-github-buttons';

import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule, EmojiLoaderModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer.component';
import { from, map } from 'rxjs';

@NgModule({
  declarations: [AppComponent, FooterComponent],
  imports: [
    BrowserModule,
    CommonModule,
    PickerModule,
    EmojiModule,
    GhButtonModule,
    EmojiLoaderModule.forRoot({
      skins: () => from(import('@ctrl/ngx-emoji-mart/emojis')).pipe(map(m => m.skins)),
      emojis: () => from(import('@ctrl/ngx-emoji-mart/emojis')).pipe(map(m => m.emojis)),
      categories: () => from(import('@ctrl/ngx-emoji-mart/emojis')).pipe(map(m => m.categories)),
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
