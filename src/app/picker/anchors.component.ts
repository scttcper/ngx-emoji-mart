import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
        [class.emoji-mart-anchor-selected]="isSelected"
        [style.color]="isSelected ? color : null"
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
})
export class AnchorsComponent implements OnInit {
  @Input() categories: any = [];
  @Input() color: any = [];
  @Output() anchorClick = new EventEmitter<any>();
  svgs = SVGs;

  constructor() { }

  ngOnInit() {
  }

  handleClick($event, index) {
    this.anchorClick.emit({
      category: this.categories[index],
      index,
    });
  }

}
