import { Emoji, EmojiComponent, EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
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
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';

import { EmojiFrequentlyService } from './emoji-frequently.service';

@Component({
  selector: 'emoji-category',
  template: `
    <section
      #container
      class="emoji-mart-category"
      [attr.aria-label]="i18n.categories[id]"
      [class.emoji-mart-no-results]="noEmojiToDisplay"
      [ngStyle]="containerStyles"
    >
      <div class="emoji-mart-category-label" [ngStyle]="labelStyles" [attr.data-name]="name">
        <!-- already labeled by the section aria-label -->
        <span #label [ngStyle]="labelSpanStyles" aria-hidden="true">
          {{ i18n.categories[id] }}
        </span>
      </div>

      <div *ngIf="virtualize; else normalRenderTemplate">
        <div *ngIf="filteredEmojis$ | async as filteredEmojis">
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
            [useButton]="emojiUseButton"
            (emojiOverOutsideAngular)="emojiOverOutsideAngular.emit($event)"
            (emojiLeaveOutsideAngular)="emojiLeaveOutsideAngular.emit($event)"
            (emojiClickOutsideAngular)="emojiClickOutsideAngular.emit($event)"
          ></ngx-emoji>
        </div>
      </div>

      <div *ngIf="noEmojiToDisplay">
        <div>
          <ngx-emoji
            [emoji]="notFoundEmoji"
            [size]="38"
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
      <ngx-emoji
        *ngFor="let emoji of emojisToDisplay; trackBy: trackById"
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
        [useButton]="emojiUseButton"
        (emojiOverOutsideAngular)="emojiOverOutsideAngular.emit($event)"
        (emojiLeaveOutsideAngular)="emojiLeaveOutsideAngular.emit($event)"
        (emojiClickOutsideAngular)="emojiClickOutsideAngular.emit($event)"
      ></ngx-emoji>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: true,
  imports: [CommonModule, EmojiComponent],
})
export class CategoryComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() emojis: any[] | null = null;
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
  @Input() virtualizeOffset = 0;
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

  /**
   * Note: the suffix is added explicitly so we know the event is dispatched outside of the Angular zone.
   */
  @Output() emojiOverOutsideAngular: Emoji['emojiOver'] = new EventEmitter();
  @Output() emojiLeaveOutsideAngular: Emoji['emojiLeave'] = new EventEmitter();
  @Output() emojiClickOutsideAngular: Emoji['emojiClick'] = new EventEmitter();

  @ViewChild('container', { static: true }) container!: ElementRef;
  @ViewChild('label', { static: true }) label!: ElementRef;
  containerStyles: any = {};
  emojisToDisplay: any[] = [];
  private filteredEmojisSubject = new Subject<any[] | null | undefined>();
  filteredEmojis$: Observable<any[] | null | undefined> = this.filteredEmojisSubject.asObservable();
  labelStyles: any = {};
  labelSpanStyles: any = {};
  margin = 0;
  minMargin = 0;
  maxMargin = 0;
  top = 0;
  rows = 0;

  constructor(
    public ref: ChangeDetectorRef,
    private emojiService: EmojiService,
    private frequently: EmojiFrequentlyService,
  ) {}

  ngOnInit() {
    this.updateRecentEmojis();
    this.emojisToDisplay = this.filterEmojis();

    if (this.noEmojiToDisplay) {
      this.containerStyles = { display: 'none' };
    }

    if (!this.hasStickyPosition) {
      this.labelStyles = { height: 28 };
      // this.labelSpanStyles = { position: 'absolute' };
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.emojis?.currentValue?.length !== changes.emojis?.previousValue?.length) {
      this.emojisToDisplay = this.filterEmojis();
      this.ngAfterViewInit();
    }
  }

  ngAfterViewInit() {
    if (!this.virtualize) {
      return;
    }

    const { width } = this.container.nativeElement.getBoundingClientRect();

    const perRow = Math.floor(width / (this.emojiSize + 12));
    this.rows = Math.ceil(this.emojisToDisplay.length / perRow);

    this.containerStyles = {
      ...this.containerStyles,
      minHeight: `${this.rows * (this.emojiSize + 12) + 28}px`,
    };

    this.ref.detectChanges();

    this.handleScroll(this.container.nativeElement.parentNode.parentNode.scrollTop);
  }

  get noEmojiToDisplay(): boolean {
    return this.emojisToDisplay.length === 0;
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

      if (
        parentHeight + (parentHeight + this.virtualizeOffset) >= top &&
        -height - (parentHeight + this.virtualizeOffset) <= top
      ) {
        this.filteredEmojisSubject.next(this.emojisToDisplay);
      } else {
        this.filteredEmojisSubject.next([]);
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

  updateRecentEmojis() {
    if (this.name !== 'Recent') {
      return;
    }

    let frequentlyUsed = this.recent || this.frequently.get(this.perLine, this.totalFrequentLines);
    if (!frequentlyUsed || !frequentlyUsed.length) {
      frequentlyUsed = this.frequently.get(this.perLine, this.totalFrequentLines);
    }
    if (!frequentlyUsed.length) {
      return;
    }
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

  updateDisplay(display: 'none' | 'block') {
    this.containerStyles.display = display;
    this.updateRecentEmojis();
    this.ref.detectChanges();
  }

  trackById(index: number, item: any) {
    return item;
  }

  private filterEmojis(): any[] {
    const newEmojis = [];
    for (const emoji of this.emojis || []) {
      if (!emoji) {
        continue;
      }
      const data = this.emojiService.getData(emoji);
      if (!data || (data.obsoletedBy && this.hideObsolete) || (!data.unified && !data.custom)) {
        continue;
      }
      newEmojis.push(emoji);
    }
    return newEmojis;
  }
}
