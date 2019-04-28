import { async, TestBed } from '@angular/core/testing';

import { ButtonService, NtkmeButtonModule } from '@ctrl/ngx-github-buttons';
import { from } from 'rxjs';

import { PickerModule } from '../lib/picker/picker.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer.component';

class FakeButtonService {
  repo(user: string, repo: string) {
    return from<any>({ stargazers_count: 0 });
  }
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PickerModule, NtkmeButtonModule],
      declarations: [AppComponent, FooterComponent],
      providers: [{ provide: ButtonService, useClass: FakeButtonService }],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
