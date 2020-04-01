import { copyFileSync } from 'fs';
import { ngPackagr } from 'ng-packagr';
import { join } from 'path';

async function main() {
  await ngPackagr()
    .forProject(join(process.cwd(), 'src/lib/picker/package.json'))
    .build();

  copyFileSync(
    join(process.cwd(), 'README.md'),
    join(process.cwd(), 'dist/README.md'),
  );
  copyFileSync(
    join(process.cwd(), 'LICENSE'),
    join(process.cwd(), 'dist/LICENSE'),
  );
  copyFileSync(
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
