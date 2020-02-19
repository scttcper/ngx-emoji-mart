import { copySync } from 'fs-extra';
import { ngPackagr } from 'ng-packagr';
import { join } from 'path';
import * as del from 'del';

async function main() {
  // cleanup dist
  del.sync(join(process.cwd(), '/dist'));

  await ngPackagr()
    .forProject(join(process.cwd(), 'src/lib/picker/package.json'))
    .build();

  copySync(
    join(process.cwd(), 'README.md'),
    join(process.cwd(), 'dist/README.md'),
  );
  copySync(
    join(process.cwd(), 'LICENSE'),
    join(process.cwd(), 'dist/LICENSE'),
  );
  copySync(
    join(process.cwd(), 'src/lib/picker/picker.css'),
    join(process.cwd(), 'dist/picker.css'),
  );
}

main()
  .then(() => console.log('success'))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
