import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { EmojiSearch } from './emoji-search.service';

@Component({
  selector: 'emoji-search',
  template: `
  <div class="emoji-mart-search">
    <input #inputRef type="text"
      [placeholder]="i18n.search" [autofocus]="autoFocus"
      [(ngModel)]="query" (ngModelChange)="handleChange()"
    />
  </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class SearchComponent implements AfterViewInit {
  @Input() maxResults = 75;
  @Input() autoFocus = false;
  @Input() i18n: any;
  @Input() include: string[] = [];
  @Input() exclude: string[] = [];
  @Input() custom: any[] = [];
  @Input() emojisToShowFilter?: (x: any) => boolean;
  @Output() search = new EventEmitter<any>();
  @ViewChild('inputRef') private inputRef?: ElementRef;
  query = '';

  constructor(private emojiSearch: EmojiSearch) {}

  ngAfterViewInit() {
    if (this.autoFocus && this.inputRef) {
      this.inputRef.nativeElement.focus();
    }
  }
  handleChange() {
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
}
