import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
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
})
export class PickerComponent implements OnInit {
  @Input() perLine = 9;
  @Input() totalFrequentLines = 4;
  @Input() i18n: any = {};
  @Input() style: any = {};
  @Input() title = 'Emoji Mart™';
  @Input() emoji = 'department_store';
  @Input() darkMode = !!(
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-color-scheme: dark)').matches
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
  @Input() include?: string[];
  @Input() exclude?: string[];
  @Input() notFoundEmoji = 'sleuth_or_spy';
  @Input() categoriesIcons = icons.categories;
  @Input() searchIcons = icons.search;
  @Input() useButton = false;
  @Input() enableFrequentEmojiSort = false;
  @Input() enableSearch = true;
  @Input() showSingleCategory = false;
  @Output() emojiClick = new EventEmitter<any>();
  @Output() emojiSelect = new EventEmitter<any>();
  @Output() skinChange = new EventEmitter<Emoji['skin']>();
  @ViewChild('scrollRef', { static: true }) private scrollRef!: ElementRef;
  @ViewChild('previewRef') private previewRef!: PreviewComponent;
  @ViewChild('searchRef', { static: true }) private searchRef!: SearchComponent;
  @ViewChildren('categoryRef') private categoryRefs!: QueryList<CategoryComponent>;
  scrollHeight = 0;
  clientHeight = 0;
  selected?: string;
  nextScroll?: string;
  scrollTop?: number;
  firstRender = true;
  recent?: string[];
  previewEmoji: any;
  leaveTimeout: any;
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

  @Input()
  backgroundImageFn: Emoji['backgroundImageFn'] = (
    set: string,
    sheetSize: number,
  ) =>
    `https://unpkg.com/emoji-datasource-${this.set}@5.0.1/img/${this.set}/sheets-256/${this.sheetSize}.png`

  constructor(
    private ref: ChangeDetectorRef,
    private frequently: EmojiFrequentlyService,
  ) {}

  ngOnInit() {
    // measure scroll
    this.measureScrollbar = measureScrollbar();

    this.i18n = { ...I18N, ...this.i18n };
    this.i18n.categories = { ...I18N.categories, ...this.i18n.categories };
    this.skin =
      JSON.parse(localStorage.getItem(`${this.NAMESPACE}.skin`) || 'null') ||
      this.skin;

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
        this.include && this.include.length
          ? this.include.indexOf(category.id) > -1
          : true;
      const isExcluded =
        this.exclude && this.exclude.length
          ? this.exclude.indexOf(category.id) > -1
          : false;
      if (!isIncluded || isExcluded) {
        continue;
      }

      if (this.emojisToShowFilter) {
        const newEmojis = [];

        const { emojis } = category;
        // tslint:disable-next-line: prefer-for-of
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
    this.setActiveCategories(this.activeCategories = this.categories.slice(0, categoriesToLoadFirst));

    // Trim last active category
    const lastActiveCategoryEmojis = this.categories[categoriesToLoadFirst - 1].emojis!.slice();
    this.categories[categoriesToLoadFirst - 1].emojis = lastActiveCategoryEmojis.slice(0, 60);

    this.ref.markForCheck();

    setTimeout(() => {
      // Restore last category
      this.categories[categoriesToLoadFirst - 1].emojis = lastActiveCategoryEmojis;
      this.setActiveCategories(this.categories);
      this.ref.markForCheck();
      setTimeout(() => this.updateCategoriesSize());
    });
  }
  setActiveCategories(categoriesToMakeActive: Array<EmojiCategory>) {
    if (this.showSingleCategory) {
      this.activeCategories = categoriesToMakeActive.filter(
        x => (x.name === this.selected || x === this.SEARCH_CATEGORY)
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
    }
  }
  handleAnchorClick($event: { category: EmojiCategory; index: number }) {
    this.updateCategoriesSize();
    this.selected = $event.category.name;
    this.setActiveCategories(this.categories);

    if (this.SEARCH_CATEGORY.emojis) {
      this.handleSearch(null);
      this.searchRef.clear();
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
    this.selected = $event.category.name;
    this.nextScroll = $event.category.name;
  }
  categoryTrack(index: number, item: any) {
    return item.id;
  }
  handleScroll() {
    if (this.nextScroll) {
      this.selected = this.nextScroll;
      this.nextScroll = undefined;
      return;
    }
    if (!this.scrollRef) {
      return;
    }
    if (this.showSingleCategory) {
      return;
    }

    let activeCategory = null;
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
          const component = this.categoryRefs.find(n => n.id === category.id);
          const active = component!.handleScroll(target.scrollTop);
          if (active) {
            activeCategory = category;
          }
        }
      }

      this.scrollTop = target.scrollTop;
    }
    if (activeCategory) {
      this.selected = activeCategory.name;
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

  handleEnterKey($event: Event, emoji?: EmojiData) {
    if (!emoji) {
      if (this.SEARCH_CATEGORY.emojis !== null && this.SEARCH_CATEGORY.emojis.length) {
        emoji = this.SEARCH_CATEGORY.emojis[0];
        if (emoji) {
          this.emojiSelect.emit({ $event, emoji });
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
      component.getEmojis();
      component.ref.markForCheck();
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
    clearTimeout(this.leaveTimeout);
  }
  handleEmojiLeave() {
    if (!this.showPreview || !this.previewRef) {
      return;
    }

    this.leaveTimeout = setTimeout(() => {
      this.previewEmoji = null;
      this.previewRef.ref.markForCheck();
    }, 16);
  }
  handleEmojiClick($event: EmojiEvent) {
    this.emojiClick.emit($event);
    this.emojiSelect.emit($event);
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
}
