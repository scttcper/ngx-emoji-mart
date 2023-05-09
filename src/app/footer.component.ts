import { Component, VERSION } from '@angular/core';
import { GhButtonModule } from '@ctrl/ngx-github-buttons';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer mb-4 mt-5">
      <div class="mb-2">
        <gh-button [count]="true" user="scttcper" repo="ngx-emoji-mart"></gh-button>
      </div>
      Demo using Angular {{ version }}
      <br />
      Released under the
      <a href="https://github.com/scttcper/ngx-emoji-mart/blob/master/LICENSE">MIT</a>
      license -
      <a href="https://github.com/scttcper/ngx-emoji-mart">View source</a>
    </footer>
  `,
  styles: [
    `
      .footer {
        line-height: 2;
        text-align: center;
        font-size: 12px;
        color: #999;
      }
    `,
  ],
  standalone: true,
  imports: [GhButtonModule],
})
export class FooterComponent {
  version = VERSION.full;
}
