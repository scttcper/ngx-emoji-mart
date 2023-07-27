import { ChangeDetectionStrategy, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { PickerModule } from './picker.module';
import { PickerComponent } from './picker.component';
import { provideEmojiLoader } from './loader';
import { categories, emojis, skins } from './emojis';

describe('PickerComponent', () => {
  @Component({
    template: '<emoji-mart title="Pick your emoji…" emoji="point_up"></emoji-mart>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [PickerModule],
  })
  class TestComponent {}

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        provideEmojiLoader({
          skins: () => of(skins),
          emojis: () => of(emojis),
          categories: () => of(categories),
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should update preview on `mouseenter` and `mouseleave` but should not trigger change detection', fakeAsync(() => {
    const picker = fixture.debugElement.query(By.directive(PickerComponent));
    expect(picker.componentInstance.previewEmoji).toEqual(null);

    // Query category that has emojis to display (does not have class `emoji-mart-no-results`).
    const emojiMartCategory = document.querySelector(
      'section.emoji-mart-category:not(.emoji-mart-no-results)',
    )!;
    const emoji = emojiMartCategory.querySelector('ngx-emoji span')!;

    emoji.dispatchEvent(new MouseEvent('mouseenter'));

    expect(picker.componentInstance.previewEmoji).toBeDefined();

    emoji.dispatchEvent(new MouseEvent('mouseleave'));

    // `requestAnimationFrame` is `setTimeout(fn, 16)` in unit tests.
    tick(16);

    expect(picker.componentInstance.previewEmoji).toEqual(null);
  }));
});
