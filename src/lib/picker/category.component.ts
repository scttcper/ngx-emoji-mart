import {
  AfterViewInit,
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
  selector: '[emoji-category]',
  template: `
  <div
    #container
    class="emoji-mart-category"
    [class.emoji-mart-no-results]="emojis && !emojis.length"
    [ngStyle]="containerStyles"
  >
    <div
      [ngStyle]="labelStyles"
      [attr.data-name]="name"
      class="emoji-mart-category-label"
    >
      <span style="labelSpanStyles" #label>
        {{ i18n.categories[id] }}
      </span>
    </div>

    <ng-template [ngIf]="emojis">
      <ngx-emoji
        *ngFor="let emoji of emojis; trackBy: trackById"
        [emoji]="emoji"
        [size]="emojiSize"
        [skin]="emojiSkin"
        [native]="emojiNative"
        [set]="emojiSet"
        [sheetSize]="emojiSheetSize"
        [forceSize]="emojiForceSize"
        [tooltip]="emojiTooltip"
        (emojiOver)="emojiOver.emit($event)"
        (emojiLeave)="emojiLeave.emit($event)"
        (emojiClick)="emojiClick.emit($event)"
      >
      </ngx-emoji>
    </ng-template>

    <div *ngIf="emojis && !emojis.length">
      <div>
        <ngx-emoji
          [emoji]="emoji"
          [size]="emojiSize"
          [skin]="emojiSkin"
          [native]="emojiNative"
          [set]="emojiSet"
          [sheetSize]="emojiSheetSize"
          [forceSize]="emojiForceSize"
          [tooltip]="emojiTooltip"
          (emojiOver)="emojiOver.emit($event)"
          (emojiLeave)="emojiLeave.emit($event)"
          (emojiClick)="emojiClick.emit($event)"
          >
        </ngx-emoji>
      </div>

      <div className="emoji-mart-no-results-label">
        {{ i18n.notfound }}
      </div>
    </div>

  </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class CategoryComponent implements OnInit, AfterViewInit {
  @Input() emojis?: any[] | null;
  @Input() hasStickyPosition = true;
  @Input() name = '';
  @Input() native = true;
  @Input() perLine = 9;
  @Input() recent: string[] = [];
  @Input() custom: any[] = [];
  @Input() i18n: any;
  @Input() id: any;
  @Input() emojiNative?: Emoji['native'];
  @Input() emojiSkin?: Emoji['skin'];
  @Input() emojiSize?: Emoji['size'];
  @Input() emojiSet?: Emoji['set'];
  @Input() emojiSheetSize?: Emoji['sheetSize'];
  @Input() emojiForceSize?: Emoji['forceSize'];
  @Input() emojiTooltip?: Emoji['tooltip'];
  @Output() emojiOver: Emoji['emojiOver'] = new EventEmitter();
  @Output() emojiLeave: Emoji['emojiLeave'] = new EventEmitter();
  @Output() emojiClick: Emoji['emojiClick'] = new EventEmitter();
  @ViewChild('container') container?: ElementRef;
  @ViewChild('label') label?: ElementRef;
  containerStyles: any = {};
  labelStyles: any = {};
  labelSpanStyles: any = {};
  parent?: Element;
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
      this.labelSpanStyles = { position: 'absolute' };
    }
  }

  ngAfterViewInit() {
    this.parent = this.container!.nativeElement.parentNode.parentNode;
    this.memoizeSize();
  }

  memoizeSize() {
    const {
      top,
      height,
    } = this.container!.nativeElement.getBoundingClientRect();
    const parentTop = this.parent!.getBoundingClientRect().top;
    const labelHeight = this.label!.nativeElement.getBoundingClientRect().height;

    this.top = top - parentTop + this.parent!.scrollTop;

    if (height === 0) {
      this.maxMargin = 0;
    } else {
      this.maxMargin = height - labelHeight;
    }
  }

  handleScroll(scrollTop: number) {
    let margin = scrollTop - this.top;
    margin = margin < this.minMargin ? this.minMargin : margin;
    margin = margin > this.maxMargin ? this.maxMargin : margin;

    if (margin === this.margin) {
      return;
    }

    if (!this.hasStickyPosition) {
      this.label!.nativeElement.style.top = `${margin}px`;
    }

    this.margin = margin;
    return true;
  }

  getEmojis() {
    if (this.name === 'Recent') {
      let frequentlyUsed = this.recent || this.frequently.get(this.perLine);
      if (!frequentlyUsed || !frequentlyUsed.length) {
        frequentlyUsed = this.frequently.get(this.perLine);
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
  updateDisplay(display: 'none' | 'inherit') {
    this.containerStyles.display = display;
    this.ref.detectChanges();
  }
  trackById(index: number, item: any) {
    return item;
  }
}
