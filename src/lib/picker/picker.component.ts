import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import {
  categories,
  Emoji,
  EmojiCategory,
  EmojiData,
  EmojiEvent,
} from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { CategoryComponent } from './category.component';
import { EmojiFrequentlyService } from './emoji-frequently.service';
import { PreviewComponent } from './preview.component';
import { SearchComponent } from './search.component';
import * as icons from './svgs';
import { measureScrollbar } from './utils';

import { AnchorsComponent } from './anchors.component';

const I18N: any = {
  search: 'Search',
  emojilist: 'List of emoji',
  notfound: 'No Emoji Found',
  clear: 'Clear',
  categories: {
    search: 'Search Results',
    recent: 'Frequently Used',
    people: 'Smileys & People',
    nature: 'Animals & Nature',
    foods: 'Food & Drink',
    activity: 'Activity',
    places: 'Travel & Places',
    objects: 'Objects',
    symbols: 'Symbols',
    flags: 'Flags',
    custom: 'Custom',
  },
  skintones: {
    1: 'Default Skin Tone',
    2: 'Light Skin Tone',
    3: 'Medium-Light Skin Tone',
    4: 'Medium Skin Tone',
    5: 'Medium-Dark Skin Tone',
    6: 'Dark Skin Tone',
  },
};

@Component({
  selector: 'emoji-mart',
  templateUrl: './picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: true,
  imports: [CommonModule, AnchorsComponent, SearchComponent, PreviewComponent, CategoryComponent],
})
export class PickerComponent implements OnInit, OnDestroy {
  @Input() perLine = 9;
  @Input() totalFrequentLines = 4;
  @Input() i18n: any = {};
  @Input() style: any = {};
  @Input() title = 'Emoji Mart™';
  @Input() emoji = 'department_store';
  @Input() darkMode = !!(
    typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
  );
  @Input() color = '#ae65c5';
  @Input() hideObsolete = true;
  /** all categories shown */
  @Input() categories: EmojiCategory[] = [];
  /** used to temporarily draw categories */
  @Input() activeCategories: EmojiCategory[] = [];
  @Input() set: Emoji['set'] = 'apple';
  @Input() skin: Emoji['skin'] = 1;
  /** Renders the native unicode emoji */
  @Input() isNative: Emoji['isNative'] = false;
  @Input() emojiSize: Emoji['size'] = 24;
  @Input() sheetSize: Emoji['sheetSize'] = 64;
  @Input() emojisToShowFilter?: (x: string) => boolean;
  @Input() showPreview = true;
  @Input() emojiTooltip = false;
  @Input() autoFocus = false;
  @Input() custom: any[] = [];
  @Input() hideRecent = true;
  @Input() imageUrlFn: Emoji['imageUrlFn'];
  @Input() include?: string[];
  @Input() exclude?: string[];
  @Input() notFoundEmoji = 'sleuth_or_spy';
  @Input() categoriesIcons = icons.categories;
  @Input() searchIcons = icons.search;
  @Input() useButton = false;
  @Input() enableFrequentEmojiSort = false;
  @Input() enableSearch = true;
  @Input() showSingleCategory = false;
  @Input() virtualize = false;
  @Input() virtualizeOffset = 0;
  @Input() recent?: string[];
  @Output() emojiClick = new EventEmitter<any>();
  @Output() emojiSelect = new EventEmitter<any>();
  @Output() skinChange = new EventEmitter<Emoji['skin']>();
  @ViewChild('scrollRef', { static: true }) private scrollRef!: ElementRef;
  @ViewChild(PreviewComponent, { static: false }) previewRef?: PreviewComponent;
  @ViewChild(SearchComponent, { static: false }) searchRef?: SearchComponent;
  @ViewChildren(CategoryComponent) categoryRefs!: QueryList<CategoryComponent>;
  scrollHeight = 0;
  clientHeight = 0;
  clientWidth = 0;
  selected?: string;
  nextScroll?: string;
  scrollTop?: number;
  firstRender = true;
  previewEmoji: EmojiData | null = null;
  animationFrameRequestId: number | null = null;
  NAMESPACE = 'emoji-mart';
  measureScrollbar = 0;
  RECENT_CATEGORY: EmojiCategory = {
    id: 'recent',
    name: 'Recent',
    emojis: null,
  };
  SEARCH_CATEGORY: EmojiCategory = {
    id: 'search',
    name: 'Search',
    emojis: null,
    anchor: false,
  };
  CUSTOM_CATEGORY: EmojiCategory = {
    id: 'custom',
    name: 'Custom',
    emojis: [],
  };
  private scrollListener!: () => void;

  @Input()
  backgroundImageFn: Emoji['backgroundImageFn'] = (set: string, sheetSize: number) =>
    `https://cdn.jsdelivr.net/npm/emoji-datasource-${set}@14.0.0/img/${set}/sheets-256/${sheetSize}.png`;

  constructor(
    private ngZone: NgZone,
    private renderer: Renderer2,
    private ref: ChangeDetectorRef,
    private frequently: EmojiFrequentlyService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  ngOnInit() {
    // measure scroll
    this.measureScrollbar = measureScrollbar();

    this.i18n = { ...I18N, ...this.i18n };
    this.i18n.categories = { ...I18N.categories, ...this.i18n.categories };
    this.skin =
      JSON.parse(
        (isPlatformBrowser(this.platformId) && localStorage.getItem(`${this.NAMESPACE}.skin`)) ||
          'null',
      ) || this.skin;

    const allCategories = [...categories];

    if (this.custom.length > 0) {
      this.CUSTOM_CATEGORY.emojis = this.custom.map(emoji => {
        return {
          ...emoji,
          // `<Category />` expects emoji to have an `id`.
          id: emoji.shortNames[0],
          custom: true,
        };
      });

      allCategories.push(this.CUSTOM_CATEGORY);
    }

    if (this.include !== undefined) {
      allCategories.sort((a, b) => {
        if (this.include!.indexOf(a.id) > this.include!.indexOf(b.id)) {
          return 1;
        }
        return -1;
      });
    }

    for (const category of allCategories) {
      const isIncluded =
        this.include && this.include.length ? this.include.indexOf(category.id) > -1 : true;
      const isExcluded =
        this.exclude && this.exclude.length ? this.exclude.indexOf(category.id) > -1 : false;
      if (!isIncluded || isExcluded) {
        continue;
      }

      if (this.emojisToShowFilter) {
        const newEmojis = [];

        const { emojis } = category;
        for (let emojiIndex = 0; emojiIndex < emojis!.length; emojiIndex++) {
          const emoji = emojis![emojiIndex];
          if (this.emojisToShowFilter(emoji)) {
            newEmojis.push(emoji);
          }
        }

        if (newEmojis.length) {
          const newCategory = {
            emojis: newEmojis,
            name: category.name,
            id: category.id,
          };

          this.categories.push(newCategory);
        }
      } else {
        this.categories.push(category);
      }

      this.categoriesIcons = { ...icons.categories, ...this.categoriesIcons };
      this.searchIcons = { ...icons.search, ...this.searchIcons };
    }

    const includeRecent =
      this.include && this.include.length
        ? this.include.indexOf(this.RECENT_CATEGORY.id) > -1
        : true;
    const excludeRecent =
      this.exclude && this.exclude.length
        ? this.exclude.indexOf(this.RECENT_CATEGORY.id) > -1
        : false;
    if (includeRecent && !excludeRecent) {
      this.hideRecent = false;
      this.categories.unshift(this.RECENT_CATEGORY);
    }

    if (this.categories[0]) {
      this.categories[0].first = true;
    }

    this.categories.unshift(this.SEARCH_CATEGORY);
    this.selected = this.categories.filter(category => category.first)[0].name;

    // Need to be careful if small number of categories
    const categoriesToLoadFirst = Math.min(this.categories.length, 3);
    this.setActiveCategories(
      (this.activeCategories = this.categories.slice(0, categoriesToLoadFirst)),
    );

    // Trim last active category
    const lastActiveCategoryEmojis = this.categories[categoriesToLoadFirst - 1].emojis!.slice();
    this.categories[categoriesToLoadFirst - 1].emojis = lastActiveCategoryEmojis.slice(0, 60);

    setTimeout(() => {
      // Restore last category
      this.categories[categoriesToLoadFirst - 1].emojis = lastActiveCategoryEmojis;
      this.setActiveCategories(this.categories);
      // The `setTimeout` will trigger the change detection, but since we're inside
      // the OnPush component we can run change detection locally starting from this
      // component and going down to the children.
      this.ref.detectChanges();

      isPlatformBrowser(this.platformId) &&
        this.ngZone.runOutsideAngular(() => {
          // The `updateCategoriesSize` doesn't change properties that are used
          // in templates, thus this is run in the context of the root zone to avoid
          // running change detection.
          requestAnimationFrame(() => {
            this.updateCategoriesSize();
          });
        });
    });

    this.ngZone.runOutsideAngular(() => {
      // DOM events that are listened by Angular inside the template trigger change detection
      // and also wrapped into additional functions that call `markForCheck()`. We listen `scroll`
      // in the context of the root zone since it will not trigger change detection each time
      // the `scroll` event is dispatched.
      this.scrollListener = this.renderer.listen(this.scrollRef.nativeElement, 'scroll', () => {
        this.handleScroll();
      });
    });
  }

  ngOnDestroy(): void {
    this.scrollListener?.();
    // This is called here because the component might be destroyed
    // but there will still be a `requestAnimationFrame` callback in the queue
    // that calls `detectChanges()` on the `ViewRef`. This will lead to a runtime
    // exception if the `detectChanges()` is called after the `ViewRef` is destroyed.
    this.cancelAnimationFrame();
  }

  setActiveCategories(categoriesToMakeActive: Array<EmojiCategory>) {
    if (this.showSingleCategory) {
      this.activeCategories = categoriesToMakeActive.filter(
        x => x.name === this.selected || x === this.SEARCH_CATEGORY,
      );
    } else {
      this.activeCategories = categoriesToMakeActive;
    }
  }
  updateCategoriesSize() {
    this.categoryRefs.forEach(component => component.memoizeSize());

    if (this.scrollRef) {
      const target = this.scrollRef.nativeElement;
      this.scrollHeight = target.scrollHeight;
      this.clientHeight = target.clientHeight;
      this.clientWidth = target.clientWidth;
    }
  }
  handleAnchorClick($event: { category: EmojiCategory; index: number }) {
    this.updateCategoriesSize();
    this.selected = $event.category.name;
    this.setActiveCategories(this.categories);

    if (this.SEARCH_CATEGORY.emojis) {
      this.handleSearch(null);
      this.searchRef?.clear();
      this.handleAnchorClick($event);
      return;
    }

    const component = this.categoryRefs.find(n => n.id === $event.category.id);
    if (component) {
      let { top } = component;

      if ($event.category.first) {
        top = 0;
      } else {
        top += 1;
      }
      this.scrollRef.nativeElement.scrollTop = top;
    }
    this.nextScroll = $event.category.name;

    // handle component scrolling to load emojis
    for (const category of this.categories) {
      const componentToScroll = this.categoryRefs.find(({ id }) => id === category.id);
      componentToScroll?.handleScroll(this.scrollRef.nativeElement.scrollTop);
    }
  }
  categoryTrack(index: number, item: any) {
    return item.id;
  }
  handleScroll(noSelectionChange = false) {
    if (this.nextScroll) {
      this.selected = this.nextScroll;
      this.nextScroll = undefined;
      this.ref.detectChanges();
      return;
    }
    if (!this.scrollRef) {
      return;
    }
    if (this.showSingleCategory) {
      return;
    }

    let activeCategory: EmojiCategory | undefined;
    if (this.SEARCH_CATEGORY.emojis) {
      activeCategory = this.SEARCH_CATEGORY;
    } else {
      const target = this.scrollRef.nativeElement;
      // check scroll is not at bottom
      if (target.scrollTop === 0) {
        // hit the TOP
        activeCategory = this.categories.find(n => n.first === true);
      } else if (target.scrollHeight - target.scrollTop === this.clientHeight) {
        // scrolled to bottom activate last category
        activeCategory = this.categories[this.categories.length - 1];
      } else {
        // scrolling
        for (const category of this.categories) {
          const component = this.categoryRefs.find(({ id }) => id === category.id);
          const active: boolean | undefined = component?.handleScroll(target.scrollTop);
          if (active) {
            activeCategory = category;
          }
        }
      }

      this.scrollTop = target.scrollTop;
    }
    // This will allow us to run the change detection only when the category changes.
    if (!noSelectionChange && activeCategory && activeCategory.name !== this.selected) {
      this.selected = activeCategory.name;
      this.ref.detectChanges();
    } else if (noSelectionChange) {
      this.ref.detectChanges();
    }
  }

  handleSearch($emojis: any[] | null) {
    this.SEARCH_CATEGORY.emojis = $emojis;
    for (const component of this.categoryRefs.toArray()) {
      if (component.name === 'Search') {
        component.emojis = $emojis;
        component.updateDisplay($emojis ? 'block' : 'none');
      } else {
        component.updateDisplay($emojis ? 'none' : 'block');
      }
    }

    this.scrollRef.nativeElement.scrollTop = 0;
    this.handleScroll();
  }

  handleEnterKey($event: Event, emoji?: EmojiData): void {
    // Note: the `handleEnterKey` is invoked when the search component dispatches the
    //       `enterKeyOutsideAngular` event or when any emoji is clicked thus `emojiClickOutsideAngular`
    //       event is dispatched. Both events are dispatched outside of the Angular zone to prevent
    //       no-op ticks, basically when users outside of the picker component are not listening
    //       to any of these events.

    if (!emoji) {
      if (this.SEARCH_CATEGORY.emojis !== null && this.SEARCH_CATEGORY.emojis.length) {
        emoji = this.SEARCH_CATEGORY.emojis[0];
        if (emoji) {
          dispatchInAngularContextIfObserved(this.emojiSelect, this.ngZone, { $event, emoji });
        } else {
          return;
        }
      }
    }

    if (!this.hideRecent && !this.recent && emoji) {
      this.frequently.add(emoji);
    }

    const component = this.categoryRefs.toArray()[1];
    if (component && this.enableFrequentEmojiSort) {
      this.ngZone.run(() => {
        component.updateRecentEmojis();
        component.ref.markForCheck();
      });
    }
  }
  handleEmojiOver($event: EmojiEvent) {
    if (!this.showPreview || !this.previewRef) {
      return;
    }

    const emojiData = this.CUSTOM_CATEGORY.emojis!.find(
      (customEmoji: any) => customEmoji.id === $event.emoji.id,
    );
    if (emojiData) {
      $event.emoji = { ...emojiData };
    }

    this.previewEmoji = $event.emoji;
    this.cancelAnimationFrame();
    this.ref.detectChanges();
  }

  handleEmojiLeave() {
    if (!this.showPreview || !this.previewRef) {
      return;
    }
    // Note: `handleEmojiLeave` will be invoked outside of the Angular zone because of the `mouseleave`
    //       event set up outside of the Angular zone in `ngx-emoji`. See `setupMouseLeaveListener`.
    //       This is done explicitly because we don't have to run redundant change detection since we
    //       would still want to leave the Angular zone here when scheduling animation frame.
    this.animationFrameRequestId = requestAnimationFrame(() => {
      this.previewEmoji = null;
      this.ref.detectChanges();
    });
  }

  handleEmojiClick($event: EmojiEvent) {
    // Note: we're getting back into the Angular zone because click events on emojis are handled
    //       outside of the Angular zone.
    dispatchInAngularContextIfObserved(this.emojiClick, this.ngZone, $event);
    dispatchInAngularContextIfObserved(this.emojiSelect, this.ngZone, $event);
    this.handleEnterKey($event.$event, $event.emoji);
  }

  handleSkinChange(skin: Emoji['skin']) {
    this.skin = skin;
    localStorage.setItem(`${this.NAMESPACE}.skin`, String(skin));
    this.skinChange.emit(skin);
  }

  getWidth(): string {
    if (this.style && this.style.width) {
      return this.style.width;
    }
    return this.perLine * (this.emojiSize + 12) + 12 + 2 + this.measureScrollbar + 'px';
  }

  private cancelAnimationFrame(): void {
    if (this.animationFrameRequestId !== null) {
      cancelAnimationFrame(this.animationFrameRequestId);
      this.animationFrameRequestId = null;
    }
  }
}

/**
 * This is only a helper function because the same code is being re-used many times.
 */
function dispatchInAngularContextIfObserved<T>(
  emitter: EventEmitter<T>,
  ngZone: NgZone,
  value: T,
): void {
  if (emitter.observed) {
    ngZone.run(() => emitter.emit(value));
  }
}
