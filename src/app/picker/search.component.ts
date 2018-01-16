import {
  Component,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { search } from '../utils/emoji-index';

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
})
export class SearchComponent implements AfterViewInit {
  @Input() maxResults = 75;
  @Input() autoFocus = true;
  @Input() i18n: any;
  @Input() include: any[];
  @Input() exclude: any[];
  @Input() custom: any[];
  query = '';
  @Input() emojisToShowFilter: (x: any) => boolean;
  @Output() search = new EventEmitter<any>();
  @ViewChild('inputRef') private inputRef: ElementRef;

  constructor() {}

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.inputRef.nativeElement.focus();
    }
  }
  handleChange() {
    this.search.emit(
      search(
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
