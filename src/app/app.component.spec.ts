import { async, TestBed } from '@angular/core/testing';

import { NtkmeButtonModule } from '@ctrl/ngx-github-buttons';

import { PickerModule } from '../lib/picker/picker.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PickerModule,
        NtkmeButtonModule,
      ],
      declarations: [
        AppComponent,
        FooterComponent,
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
