import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideEmojiLoader } from '@ctrl/ngx-emoji-mart/loader';
import { categories, emojis, skins } from '@ctrl/ngx-emoji-mart/emojis';
import { of } from 'rxjs';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideEmojiLoader({
          skins: () => of(skins),
          emojis: () => of(emojis),
          categories: () => of(categories),
        }),
      ],
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
