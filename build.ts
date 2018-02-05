
import { copySync } from 'fs-extra';
import { build } from 'ng-packagr';
import { join } from 'path';
import * as rimraf from 'rimraf';



async function main() {
  // cleanup dist
  rimraf.sync(join(process.cwd(), '/dist'));

  // make emoi
  await build({
    project: join(process.cwd(), 'src/lib/emoji/package.json'),
  });


  rimraf.sync(join(process.cwd(), `/src/lib/picker/node_modules`));
  copySync(
    join(process.cwd(), '/dist/ngx-emoji'),
    join(process.cwd(), `/src/lib/picker/node_modules/@ctrl/ngx-emoji-mart/ngx-emoji`),
  );
  await build({
    project: join(process.cwd(), `src/lib/picker/package.json`),
  });
  copySync(
    join(process.cwd(), '/dist/picker'),
    join(process.cwd(), '/dist/packages-dist'),
  );
  copySync(
    join(process.cwd(), '/dist/ngx-emoji'),
    join(process.cwd(), '/dist/packages-dist/ngx-emoji'),
  );

  copySync(join(process.cwd(), 'README.md'), join(process.cwd(), 'dist/packages-dist/README.md'));
  copySync(join(process.cwd(), 'LICENSE'), join(process.cwd(), 'dist/packages-dist/LICENSE'));
  copySync(join(process.cwd(), 'src/lib/picker/picker.css'), join(process.cwd(), 'dist/packages-dist/picker.css'));
}

main()
  .then(() => console.log('success'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });


