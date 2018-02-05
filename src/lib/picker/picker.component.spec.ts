import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickerComponent } from './picker.component';
import { PickerModule } from './picker.module';

describe('PickerComponent', () => {
  let component: PickerComponent;
  let fixture: ComponentFixture<PickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PickerModule],
    })
    .compileComponents();
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
