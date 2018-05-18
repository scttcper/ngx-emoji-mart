import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
  <footer class="footer mb-4 mt-5">
    <div class="mb-2">
      <ntkme-github-button
        count="true"
        user="typectrl"
        repo="ngx-emoji-mart"
        standardIcon="true"
      >
      </ntkme-github-button>
    </div>
    Demo using Angular {{ version }}
    <br>
    Released under the
    <a href="https://github.com/typectrl/ngx-emoji-mart/blob/master/LICENSE">MIT</a> license.
    <a href="https://github.com/typectrl/ngx-emoji-mart">View source</a>.
    Listed on <a target="_blank" href="https://angular.parts/package/@ctrl/ngx-emoji-mart">Angular.parts</a>
  </footer>
  `,
  styles: [`
  .footer {
    line-height: 2;
    text-align: center;
    font-size: 12px;
    color: #999;
  }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  version = VERSION.full;
}
