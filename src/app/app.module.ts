import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NtkmeButtonModule } from '@ctrl/ngx-github-buttons';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PickerModule } from './picker/picker.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, PickerModule, NtkmeButtonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
