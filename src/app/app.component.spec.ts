import { TestBed, waitForAsync } from '@angular/core/testing';

import { GhButtonModule } from '@ctrl/ngx-github-buttons';

import { PickerModule } from '../lib/picker/picker.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PickerModule, GhButtonModule],
      declarations: [AppComponent, FooterComponent],
    }).compileComponents();
  }));
  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
