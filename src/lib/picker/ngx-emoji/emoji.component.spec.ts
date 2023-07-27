import { ApplicationRef, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideEmojiLoader } from '@ctrl/ngx-emoji-mart/loader';

import { categories, emojis, skins } from '../emojis';
import { EmojiComponent } from './emoji.component';

describe('EmojiComponent', () => {
  it('should trigger change detection whenever `emojiOver` has observers', () => {
    @Component({
      template: '<ngx-emoji (emojiOver)="onEmojiOver()"></ngx-emoji>',
      standalone: true,
      imports: [EmojiComponent],
    })
    class TestComponent {
      onEmojiOver() {}
    }

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        provideEmojiLoader({
          skins: () => of(skins),
          emojis: () => of(emojis),
          categories: () => of(categories),
        }),
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const appRef = TestBed.inject(ApplicationRef);
    spyOn(appRef, 'tick');
    spyOn(fixture.componentInstance, 'onEmojiOver');

    const emoji = fixture.nativeElement.querySelector('span.emoji-mart-emoji');
    emoji.dispatchEvent(new MouseEvent('mouseenter'));

    expect(appRef.tick).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.onEmojiOver).toHaveBeenCalled();
  });

  it('should trigger change detection whenever `emojiLeave` has observers', () => {
    @Component({
      template: '<ngx-emoji (emojiLeave)="onEmojiLeave()"></ngx-emoji>',
      standalone: true,
      imports: [EmojiComponent],
    })
    class TestComponent {
      onEmojiLeave() {}
    }

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        provideEmojiLoader({
          skins: () => of(skins),
          emojis: () => of(emojis),
          categories: () => of(categories),
        }),
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const appRef = TestBed.inject(ApplicationRef);
    spyOn(appRef, 'tick');
    spyOn(fixture.componentInstance, 'onEmojiLeave');

    const emoji = fixture.nativeElement.querySelector('span.emoji-mart-emoji');
    emoji.dispatchEvent(new MouseEvent('mouseleave'));

    expect(appRef.tick).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.onEmojiLeave).toHaveBeenCalled();
  });

  it('should trigger change detection whenever `emojiClick` has observers', () => {
    @Component({
      template: '<ngx-emoji (emojiClick)="onEmojiClick()"></ngx-emoji>',
      standalone: true,
      imports: [EmojiComponent],
    })
    class TestComponent {
      onEmojiClick() {}
    }

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        provideEmojiLoader({
          skins: () => of(skins),
          emojis: () => of(emojis),
          categories: () => of(categories),
        }),
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const appRef = TestBed.inject(ApplicationRef);
    spyOn(appRef, 'tick');
    spyOn(fixture.componentInstance, 'onEmojiClick');

    const emoji = fixture.nativeElement.querySelector('span.emoji-mart-emoji');
    emoji.dispatchEvent(new MouseEvent('click'));

    expect(appRef.tick).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.onEmojiClick).toHaveBeenCalled();
  });
});
