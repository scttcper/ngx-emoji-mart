import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  themes = ['native', 'apple', 'google', 'twitter', 'emojione', 'messenger', 'facebook'];
  set = 'native';
  native = true;

  setTheme(set: string) {
    this.native = set === 'native';
    this.set = set;
  }
}
