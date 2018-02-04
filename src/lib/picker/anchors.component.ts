import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { EmojiCategory } from '../data/data.interfaces';
import SVGs from '../svgs';

@Component({
  selector: 'emoji-mart-anchors',
  template: `
  <div class="emoji-mart-anchors">
    <ng-container *ngFor="let category of categories; let idx = index">
      <span
        *ngIf="category.anchor !== false"
        title="i18n.categories[category.id]"
        (click)="this.handleClick($event, idx)"
        class="emoji-mart-anchor"
        [class.emoji-mart-anchor-selected]="category.name === selected"
        [style.color]="category.name === selected ? color : null"
      >
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path [attr.d]="svgs[category.id]" />
          </svg>
        </div>
        <span
          class="emoji-mart-anchor-bar"
          [style.background-color]="color"
        ></span>
      </span>
    </ng-container>
  </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class AnchorsComponent implements OnInit {
  @Input() categories: EmojiCategory[] = [];
  @Input() color: any = [];
  @Input() selected: string;
  @Output() anchorClick = new EventEmitter<{ category: EmojiCategory, index: number }>();
  svgs = SVGs;

  constructor() {

  }

  ngOnInit() {
  }

  handleClick($event: Event, index: number) {
    this.anchorClick.emit({
      category: this.categories[index],
      index,
    });
  }

}
