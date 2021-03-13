import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { Emoji, EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Observable, Subject } from 'rxjs';
import { EmojiFrequentlyService } from './emoji-frequently.service';

@Component({
  selector: 'emoji-category',
  template: `
    <section
      #container
      class="emoji-mart-category"
      [attr.aria-label]="i18n.categories[id]"
      [class.emoji-mart-no-results]="emojis && !emojis.length"
      [ngStyle]="containerStyles"
    >
      <div class="emoji-mart-category-label" [ngStyle]="labelStyles" [attr.data-name]="name">
        <!-- already labeled by the section aria-label -->
        <span #label [ngStyle]="labelSpanStyles" aria-hidden="true">
          {{ i18n.categories[id] }}
        </span>
      </div>

      <div
        *ngIf="virtualize && filteredEmojis$ | async as filteredEmojis; else normalRenderTemplate"
      >
        <ngx-emoji
          *ngFor="let emoji of filteredEmojis; trackBy: trackById"
          [emoji]="emoji"
          [size]="emojiSize"
          [skin]="emojiSkin"
          [isNative]="emojiIsNative"
          [set]="emojiSet"
          [sheetSize]="emojiSheetSize"
          [forceSize]="emojiForceSize"
          [tooltip]="emojiTooltip"
          [backgroundImageFn]="emojiBackgroundImageFn"
          [imageUrlFn]="emojiImageUrlFn"
          [hideObsolete]="hideObsolete"
          (emojiOver)="emojiOver.emit($event)"
          (emojiLeave)="emojiLeave.emit($event)"
          (emojiClick)="emojiClick.emit($event)"
        ></ngx-emoji>
      </div>

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

    <ng-template #normalRenderTemplate>
      <div *ngIf="!virtualize && emojis">
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
          [imageUrlFn]="emojiImageUrlFn"
          [hideObsolete]="hideObsolete"
          (emojiOver)="emojiOver.emit($event)"
          (emojiLeave)="emojiLeave.emit($event)"
          (emojiClick)="emojiClick.emit($event)"
        ></ngx-emoji>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class CategoryComponent implements OnChanges, OnInit, AfterViewInit {
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
  @Input() virtualize = false;
  @Input() emojiIsNative?: Emoji['isNative'];
  @Input() emojiSkin!: Emoji['skin'];
  @Input() emojiSize!: Emoji['size'];
  @Input() emojiSet!: Emoji['set'];
  @Input() emojiSheetSize!: Emoji['sheetSize'];
  @Input() emojiForceSize!: Emoji['forceSize'];
  @Input() emojiTooltip!: Emoji['tooltip'];
  @Input() emojiBackgroundImageFn?: Emoji['backgroundImageFn'];
  @Input() emojiImageUrlFn?: Emoji['imageUrlFn'];
  @Input() emojiUseButton?: boolean;
  @Output() emojiOver: Emoji['emojiOver'] = new EventEmitter();
  @Output() emojiLeave: Emoji['emojiLeave'] = new EventEmitter();
  @Output() emojiClick: Emoji['emojiClick'] = new EventEmitter();
  @ViewChild('container', { static: true }) container!: ElementRef;
  @ViewChild('label', { static: true }) label!: ElementRef;
  containerStyles: any = {};
  private _filteredEmojis = new Subject<any[] | null | undefined>();
  filteredEmojis$: Observable<any[] | null | undefined> = this._filteredEmojis.asObservable();
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.emojis?.currentValue?.length !== changes.emojis?.previousValue?.length) {
      this.ngAfterViewInit();
    }
  }

  ngAfterViewInit() {
    if (!this.virtualize || !this.emojis?.length) {
      return;
    }

    const parent = this.container.nativeElement.parentNode.parentNode;
    const { width } = parent.getBoundingClientRect();

    const rows = Math.ceil((this.emojis.length * (this.emojiSize + 12)) / width);

    this.containerStyles = {
      ...this.containerStyles,
      minHeight: `${rows * (this.emojiSize + 12) + 28}px`,
    };

    this.ref?.detectChanges();

    this.handleScroll(this.container.nativeElement.parentNode.parentNode.scrollTop);
  }

  memoizeSize() {
    const parent = this.container.nativeElement.parentNode.parentNode;
    const { top, height } = this.container.nativeElement.getBoundingClientRect();
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

    if (this.virtualize) {
      const { top, height } = this.container.nativeElement.getBoundingClientRect();
      const parentHeight = this.container.nativeElement.parentNode.parentNode.clientHeight;

      if (parentHeight + 200 >= top && -height - 200 <= top) {
        this._filteredEmojis.next(this.emojis);
      }
    }

    if (margin === this.margin) {
      this.ref.detectChanges();
      return false;
    }

    if (!this.hasStickyPosition) {
      this.label.nativeElement.style.top = `${margin}px`;
    }

    this.margin = margin;
    this.ref.detectChanges();
    return true;
  }

  getEmojis() {
    if (this.name === 'Recent') {
      let frequentlyUsed =
        this.recent || this.frequently.get(this.perLine, this.totalFrequentLines);
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
