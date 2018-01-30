import buildSearch from '../utils/build-search';
import emojis from './emojis';

function uncompress(list) {
  for (const datum of list) {

    if (!datum.short_names) {
      datum.short_names = [];
    }
    datum.short_names.unshift(datum.short_name);

    datum.sheet_x = datum.sheet[0];
    datum.sheet_y = datum.sheet[1];
    delete datum.sheet;

    if (!datum.text) {
      datum.text = '';
    }
    if (datum.added_in !== null && !datum.added_in) {
      datum.added_in = '6.0';
    }

    datum.search = buildSearch({
      short_names: datum.short_names,
      name: datum.name,
      keywords: datum.keywords,
      emoticons: datum.emoticons,
    });
  }
}

uncompress(emojis);
// uncompress(data.skins);

export default emojis;
