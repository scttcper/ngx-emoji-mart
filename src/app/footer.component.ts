import { Component, OnInit, VERSION } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
  <footer class="footer mb-4 mt-5">
    <div class="mb-1">
      <mdo-github-button
        count="true"
        user="typectrl"
        repo="ngx-codemirror"
        >
      </mdo-github-button>
    </div>
    Demo using Angular {{ version }}
    <br>
    Released under the
    <a href="https://github.com/typectrl/ngx-codemirror/blob/master/LICENSE">MIT</a> license.
    <a href="https://github.com/typectrl/ngx-codemirror">View source</a>.
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
})
export class FooterComponent implements OnInit {
  version = VERSION.full;
  constructor() { }

  ngOnInit() {
  }

}
