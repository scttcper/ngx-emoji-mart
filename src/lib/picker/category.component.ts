import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { Emoji, EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EmojiFrequentlyService } from './emoji-frequently.service';

@Component({
  selector: 'emoji-category',
  template: `
  <section #container class="emoji-mart-category"
    [attr.aria-label]="i18n.categories[id]"
    [class.emoji-mart-no-results]="emojis && !emojis.length"
    [ngStyle]="containerStyles">
    <div class="emoji-mart-category-label"
      [ngStyle]="labelStyles"
      [attr.data-name]="name">
      <!-- already labeled by the section aria-label -->
      <span #label [ngStyle]="labelSpanStyles" aria-hidden="true">
        {{ i18n.categories[id] }}
      </span>
    </div>

    <ng-template [ngIf]="emojis">
      <ngx-emoji
        *ngFor="let emoji of emojis; trackBy: trackById"
        [emoji]="emoji"
        [size]="emojiSize"
        [skin]="emojiSkin"
        [isNative]="emojiIsNative"
        [set]="emojiSet"
        [sheetSize]="emojiSheetSize"
        [forceSize]="emojiForceSize"
        [tooltip]="emojiTooltip"
        [backgroundImageFn]="emojiBackgroundImageFn"
        [hideObsolete]="hideObsolete"
        (emojiOver)="emojiOver.emit($event)"
        (emojiLeave)="emojiLeave.emit($event)"
        (emojiClick)="emojiClick.emit($event)"
      ></ngx-emoji>
    </ng-template>

    <div *ngIf="emojis && !emojis.length">
      <div>
        <ngx-emoji
          [emoji]="notFoundEmoji"
          size="38"
          [skin]="emojiSkin"
          [isNative]="emojiIsNative"
          [set]="emojiSet"
          [sheetSize]="emojiSheetSize"
          [forceSize]="emojiForceSize"
          [tooltip]="emojiTooltip"
          [backgroundImageFn]="emojiBackgroundImageFn"
          [useButton]="emojiUseButton"
        ></ngx-emoji>
      </div>

      <div class="emoji-mart-no-results-label">
        {{ i18n.notfound }}
      </div>
    </div>

  </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class CategoryComponent implements OnInit {
  @Input() emojis?: any[] | null;
  @Input() hasStickyPosition = true;
  @Input() name = '';
  @Input() perLine = 9;
  @Input() totalFrequentLines = 4;
  @Input() recent: string[] = [];
  @Input() custom: any[] = [];
  @Input() i18n: any;
  @Input() id: any;
  @Input() hideObsolete = true;
  @Input() notFoundEmoji?: string;
  @Input() emojiIsNative?: Emoji['isNative'];
  @Input() emojiSkin!: Emoji['skin'];
  @Input() emojiSize!: Emoji['size'];
  @Input() emojiSet!: Emoji['set'];
  @Input() emojiSheetSize!: Emoji['sheetSize'];
  @Input() emojiForceSize!: Emoji['forceSize'];
  @Input() emojiTooltip!: Emoji['tooltip'];
  @Input() emojiBackgroundImageFn?: Emoji['backgroundImageFn'];
  @Input() emojiUseButton?: boolean;
  @Output() emojiOver: Emoji['emojiOver'] = new EventEmitter();
  @Output() emojiLeave: Emoji['emojiLeave'] = new EventEmitter();
  @Output() emojiClick: Emoji['emojiClick'] = new EventEmitter();
  @ViewChild('container', { static: true }) container!: ElementRef;
  @ViewChild('label', { static: true }) label!: ElementRef;
  containerStyles: any = {};
  labelStyles: any = {};
  labelSpanStyles: any = {};
  margin = 0;
  minMargin = 0;
  maxMargin = 0;
  top = 0;

  constructor(
    public ref: ChangeDetectorRef,
    private emojiService: EmojiService,
    private frequently: EmojiFrequentlyService,
  ) {}

  ngOnInit() {
    this.emojis = this.getEmojis();

    if (!this.emojis) {
      this.containerStyles = { display: 'none' };
    }

    if (!this.hasStickyPosition) {
      this.labelStyles = { height: 28 };
      // this.labelSpanStyles = { position: 'absolute' };
    }
  }
  memoizeSize() {
    const parent = this.container.nativeElement.parentNode.parentNode;
    const {
      top,
      height,
    } = this.container.nativeElement.getBoundingClientRect();
    const parentTop = parent.getBoundingClientRect().top;
    const labelHeight = this.label.nativeElement.getBoundingClientRect().height;

    this.top = top - parentTop + parent.scrollTop;

    if (height === 0) {
      this.maxMargin = 0;
    } else {
      this.maxMargin = height - labelHeight;
    }
  }
  handleScroll(scrollTop: number): boolean {
    let margin = scrollTop - this.top;
    margin = margin < this.minMargin ? this.minMargin : margin;
    margin = margin > this.maxMargin ? this.maxMargin : margin;

    if (margin === this.margin) {
      return false;
    }

    if (!this.hasStickyPosition) {
      this.label.nativeElement.style.top = `${margin}px`;
    }

    this.margin = margin;
    return true;
  }

  getEmojis() {
    if (this.name === 'Recent') {
      let frequentlyUsed = this.recent || this.frequently.get(this.perLine, this.totalFrequentLines);
      if (!frequentlyUsed || !frequentlyUsed.length) {
        frequentlyUsed = this.frequently.get(this.perLine, this.totalFrequentLines);
      }
      if (frequentlyUsed.length) {
        this.emojis = frequentlyUsed
          .map(id => {
            const emoji = this.custom.filter((e: any) => e.id === id)[0];
            if (emoji) {
              return emoji;
            }

            return id;
          })
          .filter(id => !!this.emojiService.getData(id));
      }

      if ((!this.emojis || this.emojis.length === 0) && frequentlyUsed.length > 0) {
        return null;
      }
    }

    if (this.emojis) {
      this.emojis = this.emojis.slice(0);
    }

    return this.emojis;
  }
  updateDisplay(display: 'none' | 'block') {
    this.containerStyles.display = display;
    this.getEmojis();
    this.ref.detectChanges();
  }
  trackById(index: number, item: any) {
    return item;
  }
}
