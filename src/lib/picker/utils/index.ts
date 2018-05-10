function uniq(arr: any[]) {
  return arr.reduce((acc: Array<any>, item: any) => {
    if (!acc.includes(item)) {
      acc.push(item);
    }
    return acc;
  }, []);
}

export function intersect(a: any, b: any) {
  const uniqA = uniq(a);
  const uniqB = uniq(b);

  return uniqA.filter((item: any) => uniqB.indexOf(item) >= 0);
}

// https://github.com/sonicdoe/measure-scrollbar
export function measureScrollbar() {
  if (typeof document === 'undefined') {
    return 0;
  }
  const div = document.createElement('div');

  div.style.width = '100px';
  div.style.height = '100px';
  div.style.overflow = 'scroll';
  div.style.position = 'absolute';
  div.style.top = '-9999px';

  document.body.appendChild(div);
  const scrollbarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);

  return scrollbarWidth;
}
