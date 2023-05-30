import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EMPTY, Subject, fromEvent, switchMap, takeUntil } from 'rxjs';

import { EmojiData } from './data/data.interfaces';
import { DEFAULT_BACKGROUNDFN, EmojiService } from './emoji.service';

export interface Emoji {
  /** Renders the native unicode emoji */
  isNative: boolean;
  forceSize: boolean;
  tooltip: boolean;
  skin: 1 | 2 | 3 | 4 | 5 | 6;
  sheetSize: 16 | 20 | 32 | 64 | 72;
  sheetRows?: number;
  set: 'apple' | 'google' | 'twitter' | 'facebook' | '';
  size: number;
  emoji: string | EmojiData;
  backgroundImageFn: (set: string, sheetSize: number) => string;
  fallback?: (data: any, props: any) => string;
  emojiOver: EventEmitter<EmojiEvent>;
  emojiLeave: EventEmitter<EmojiEvent>;
  emojiClick: EventEmitter<EmojiEvent>;
  imageUrlFn?: (emoji: EmojiData | null) => string;
}

export interface EmojiEvent {
  emoji: EmojiData;
  $event: Event;
}

@Component({
  selector: 'ngx-emoji',
  template: `
    <ng-template [ngIf]="isVisible">
      <button
        *ngIf="useButton; else spanTpl"
        #button
        type="button"
        [attr.title]="title"
        [attr.aria-label]="label"
        class="emoji-mart-emoji"
        [class.emoji-mart-emoji-native]="isNative"
        [class.emoji-mart-emoji-custom]="custom"
      >
        <span [ngStyle]="style">
          <ng-template [ngIf]="isNative">{{ unified }}</ng-template>
          <ng-content></ng-content>
        </span>
      </button>
    </ng-template>

    <ng-template #spanTpl>
      <span
        #button
        [attr.title]="title"
        [attr.aria-label]="label"
        class="emoji-mart-emoji"
        [class.emoji-mart-emoji-native]="isNative"
        [class.emoji-mart-emoji-custom]="custom"
      >
        <span [ngStyle]="style">
          <ng-template [ngIf]="isNative">{{ unified }}</ng-template>
          <ng-content></ng-content>
        </span>
      </span>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: true,
  imports: [CommonModule],
})
export class EmojiComponent implements OnChanges, Emoji, OnDestroy {
  @Input() skin: Emoji['skin'] = 1;
  @Input() set: Emoji['set'] = 'apple';
  @Input() sheetSize: Emoji['sheetSize'] = 64;
  /** Renders the native unicode emoji */
  @Input() isNative: Emoji['isNative'] = false;
  @Input() forceSize: Emoji['forceSize'] = false;
  @Input() tooltip: Emoji['tooltip'] = false;
  @Input() size: Emoji['size'] = 24;
  @Input() emoji: Emoji['emoji'] = '';
  @Input() fallback?: Emoji['fallback'];
  @Input() hideObsolete = false;
  @Input() sheetRows?: number;
  @Input() sheetColumns?: number;
  @Input() useButton?: boolean;
  /**
   * Note: `emojiOver` and `emojiOverOutsideAngular` are dispatched on the same event (`mouseenter`), but
   *       for different purposes. The `emojiOverOutsideAngular` event is listened only in `emoji-category`
   *       component and the category component doesn't care about zone context the callback is being called in.
   *       The `emojiOver` is for backwards compatibility if anyone is listening to this event explicitly in their code.
   */
  @Output() emojiOver: Emoji['emojiOver'] = new EventEmitter();
  @Output() emojiOverOutsideAngular: Emoji['emojiOver'] = new EventEmitter();
  /** See comments above, this serves the same purpose. */
  @Output() emojiLeave: Emoji['emojiLeave'] = new EventEmitter();
  @Output() emojiLeaveOutsideAngular: Emoji['emojiLeave'] = new EventEmitter();
  @Output() emojiClick: Emoji['emojiClick'] = new EventEmitter();
  @Output() emojiClickOutsideAngular: Emoji['emojiClick'] = new EventEmitter();

  style: any;
  title?: string = undefined;
  label = '';
  unified?: string | null;
  custom = false;
  isVisible = true;
  // TODO: replace 4.0.3 w/ dynamic get verison from emoji-datasource in package.json
  @Input() backgroundImageFn: Emoji['backgroundImageFn'] = DEFAULT_BACKGROUNDFN;
  @Input() imageUrlFn?: Emoji['imageUrlFn'];

  @ViewChild('button', { static: false })
  set button(button: ElementRef<HTMLElement> | undefined) {
    // Note: `runOutsideAngular` is used to trigger `addEventListener` outside of the Angular zone
    //       too. See `setupMouseEnterListener`. The `switchMap` will subscribe to `fromEvent` considering
    //       the context where the factory is called in.
    this.ngZone.runOutsideAngular(() => this.button$.next(button?.nativeElement));
  }

  /**
   * The subject used to emit whenever view queries are run and `button` or `span` is set/removed.
   * We use subject to keep the reactive behavior so we don't have to add and remove event listeners manually.
   */
  private readonly button$ = new Subject<HTMLElement | undefined>();

  private readonly destroy$ = new Subject<void>();

  private readonly ngZone = inject(NgZone);
  private readonly emojiService = inject(EmojiService);

  constructor() {
    this.setupMouseListeners();
  }

  ngOnChanges() {
    if (!this.emoji) {
      return (this.isVisible = false);
    }
    const data = this.getData();
    if (!data) {
      return (this.isVisible = false);
    }
    // const children = this.children;
    this.unified = data.native || null;
    if (data.custom) {
      this.custom = data.custom;
    }
    if (!data.unified && !data.custom) {
      return (this.isVisible = false);
    }
    if (this.tooltip) {
      this.title = data.shortNames[0];
    }
    if (data.obsoletedBy && this.hideObsolete) {
      return (this.isVisible = false);
    }

    this.label = [data.native].concat(data.shortNames).filter(Boolean).join(', ');

    if (this.isNative && data.unified && data.native) {
      // hide older emoji before the split into gendered emoji
      this.style = { fontSize: `${this.size}px` };

      if (this.forceSize) {
        this.style.display = 'inline-block';
        this.style.width = `${this.size}px`;
        this.style.height = `${this.size}px`;
        this.style['word-break'] = 'keep-all';
      }
    } else if (data.custom) {
      this.style = {
        width: `${this.size}px`,
        height: `${this.size}px`,
        display: 'inline-block',
      };
      if (data.spriteUrl && this.sheetRows && this.sheetColumns) {
        this.style = {
          ...this.style,
          backgroundImage: `url(${data.spriteUrl})`,
          backgroundSize: `${100 * this.sheetColumns}% ${100 * this.sheetRows}%`,
          backgroundPosition: this.emojiService.getSpritePosition(data.sheet, this.sheetColumns),
        };
      } else {
        this.style = {
          ...this.style,
          backgroundImage: `url(${data.imageUrl})`,
          backgroundSize: 'contain',
        };
      }
    } else {
      if (data.hidden.length && data.hidden.includes(this.set)) {
        if (this.fallback) {
          this.style = { fontSize: `${this.size}px` };
          this.unified = this.fallback(data, this);
        } else {
          return (this.isVisible = false);
        }
      } else {
        this.style = this.emojiService.emojiSpriteStyles(
          data.sheet,
          this.set,
          this.size,
          this.sheetSize,
          this.sheetRows,
          this.backgroundImageFn,
          this.sheetColumns,
          this.imageUrlFn?.(this.getData()),
        );
      }
    }
    return (this.isVisible = true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  getData() {
    return this.emojiService.getData(this.emoji, this.skin, this.set);
  }

  getSanitizedData(): EmojiData {
    return this.emojiService.getSanitizedData(this.emoji, this.skin, this.set) as EmojiData;
  }

  private setupMouseListeners(): void {
    const eventListener$ = (eventName: string) =>
      this.button$.pipe(
        // Note: `EMPTY` is used to remove event listener once the DOM node is removed.
        switchMap(button => (button ? fromEvent(button, eventName) : EMPTY)),
        takeUntil(this.destroy$),
      );

    eventListener$('click').subscribe($event => {
      const emoji = this.getSanitizedData();
      this.emojiClickOutsideAngular.emit({ emoji, $event });
      // Note: this is done for backwards compatibility. We run change detection if developers
      //       are listening to `emojiClick` in their code. For instance:
      //       `<ngx-emoji (emojiClick)="..."></ngx-emoji>`.
      if (this.emojiClick.observed) {
        this.ngZone.run(() => this.emojiClick.emit({ emoji, $event }));
      }
    });

    eventListener$('mouseenter').subscribe($event => {
      const emoji = this.getSanitizedData();
      this.emojiOverOutsideAngular.emit({ emoji, $event });
      // Note: this is done for backwards compatibility. We run change detection if developers
      //       are listening to `emojiOver` in their code. For instance:
      //       `<ngx-emoji (emojiOver)="..."></ngx-emoji>`.
      if (this.emojiOver.observed) {
        this.ngZone.run(() => this.emojiOver.emit({ emoji, $event }));
      }
    });

    eventListener$('mouseleave').subscribe($event => {
      const emoji = this.getSanitizedData();
      this.emojiLeaveOutsideAngular.emit({ emoji, $event });
      // Note: this is done for backwards compatibility. We run change detection if developers
      //       are listening to `emojiLeave` in their code. For instance:
      //       `<ngx-emoji (emojiLeave)="..."></ngx-emoji>`.
      if (this.emojiLeave.observed) {
        this.ngZone.run(() => this.emojiLeave.emit({ emoji, $event }));
      }
    });
  }
}
