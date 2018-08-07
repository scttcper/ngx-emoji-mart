import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { EmojiSearch } from './emoji-search.service';

@Component({
  selector: 'emoji-search',
  template: `
  <div class="emoji-mart-search">
    <input #inputRef type="text"
      (keyup.enter)="handleEnterKey($event)"
      [placeholder]="i18n.search" [autofocus]="autoFocus"
      [(ngModel)]="query" (ngModelChange)="handleChange()" />
    <button class="emoji-mart-search-icon"
      (click)="clear()"
      (keyup.enter)="clear()"
      [disabled]="!isSearching">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="13" height="13" opacity="0.5">
        <path [attr.d]="icon" />
      </svg>
    </button>
  </div>
  `,
  preserveWhitespaces: false,
})
export class SearchComponent implements AfterViewInit, OnInit {
  @Input() maxResults = 75;
  @Input() autoFocus = false;
  @Input() i18n: any;
  @Input() include: string[] = [];
  @Input() exclude: string[] = [];
  @Input() custom: any[] = [];
  @Input() icons?: { [key: string]: string };
  @Input() emojisToShowFilter?: (x: any) => boolean;
  @Output() search = new EventEmitter<any>();
  @Output() enterKey = new EventEmitter<any>();
  @ViewChild('inputRef') private inputRef!: ElementRef;
  isSearching = false;
  icon?: string;
  query = '';

  constructor(private emojiSearch: EmojiSearch) {}

  ngOnInit() {
    this.icon = this.icons!.search;
  }
  ngAfterViewInit() {
    if (this.autoFocus) {
      this.inputRef.nativeElement.focus();
    }
  }
  clear() {
    this.query = '';
    this.handleSearch('');
  }
  handleEnterKey($event: Event) {
    this.enterKey.emit($event);
    $event.preventDefault();
  }
  handleSearch(value: string) {
    if (value === '') {
      this.icon = this.icons!.search;
      this.isSearching = false;
    } else {
      this.icon = this.icons!.delete;
      this.isSearching = true;
    }
    this.search.emit(
      this.emojiSearch.search(
        this.query,
        this.emojisToShowFilter,
        this.maxResults,
        this.include,
        this.exclude,
        this.custom,
      ),
    );
  }
  handleChange() {
    this.handleSearch(this.query);
  }
}
