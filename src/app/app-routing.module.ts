import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PickerComponent } from './picker/picker.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
