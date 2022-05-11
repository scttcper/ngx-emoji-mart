import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { categories, emojis, skins } from './emojis';
import { EmojiLoaderModule } from './ngx-emoji';
import { PickerComponent } from './picker.component';
import { PickerModule } from './picker.module';

describe('PickerComponent', () => {
  let component: PickerComponent;
  let fixture: ComponentFixture<PickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PickerModule,
        EmojiLoaderModule.forRoot({
          skins: () => of(skins),
          emojis: () => of(emojis),
          categories: () => of(categories),
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
