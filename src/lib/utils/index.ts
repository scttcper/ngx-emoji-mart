import categories from '../data/categories';

function uniq(arr) {
  return arr.reduce((acc, item) => {
    if (acc.indexOf(item) === -1) {
      acc.push(item);
    }
    return acc;
  }, []);
}

export function intersect(a, b) {
  const uniqA = uniq(a);
  const uniqB = uniq(b);

  return uniqA.filter(item => uniqB.indexOf(item) >= 0);
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
