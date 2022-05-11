import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { GhButtonModule } from '@ctrl/ngx-github-buttons';
import { EmojiLoaderModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { categories, emojis, skins } from '@ctrl/ngx-emoji-mart/emojis';

import { PickerModule } from '../lib/picker/picker.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PickerModule,
        GhButtonModule,
        EmojiLoaderModule.forRoot({
          skins: () => of(skins),
          emojis: () => of(emojis),
          categories: () => of(categories),
        }),
      ],
      declarations: [AppComponent, FooterComponent],
    }).compileComponents();
  }));
  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
