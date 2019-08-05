import { copySync } from 'fs-extra';
import { ngPackagr } from 'ng-packagr';
import { join } from 'path';
import * as del from 'del';

async function main() {
  // cleanup dist
  del.sync(join(process.cwd(), '/dist'));
  del.sync(join(process.cwd(), '/node_modules/@ctrl/ngx-emoji-mart'));

  // make emoi
  await ngPackagr()
    .forProject(join(process.cwd(), 'src/lib/emoji/package.json'))
    .build();

  // put it in node modules so the path resolves
  // proper path support eventually
  copySync(
    join(process.cwd(), '/dist/emoji'),
    join(process.cwd(), '/node_modules/@ctrl/ngx-emoji-mart/ngx-emoji'),
  );
  copySync(
    join(process.cwd(), '/dist/emoji'),
    join(process.cwd(), '/dist/packages-dist/ngx-emoji'),
  );

  await ngPackagr()
    .forProject(join(process.cwd(), 'src/lib/picker/package.json'))
    .build();

  copySync(
    join(process.cwd(), '/dist/picker'),
    join(process.cwd(), '/dist/packages-dist'),
  );

  copySync(
    join(process.cwd(), 'README.md'),
    join(process.cwd(), 'dist/packages-dist/README.md'),
  );
  copySync(
    join(process.cwd(), 'LICENSE'),
    join(process.cwd(), 'dist/packages-dist/LICENSE'),
  );
  copySync(
    join(process.cwd(), 'src/lib/picker/picker.css'),
    join(process.cwd(), 'dist/packages-dist/picker.css'),
  );
}

main()
  .then(() => console.log('success'))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
