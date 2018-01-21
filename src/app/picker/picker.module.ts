import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PickerComponent } from './picker.component';
import { EmojiComponent } from './emoji.component';
import { AnchorsComponent } from './anchors.component';
import { CategoryComponent } from './category.component';
import { SearchComponent } from './search.component';
import { PreviewComponent } from './preview.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [PickerComponent, EmojiComponent],
  declarations: [
    PickerComponent,
    EmojiComponent,
    AnchorsComponent,
    CategoryComponent,
    SearchComponent,
    PreviewComponent,
  ],
})
export class PickerModule {}
