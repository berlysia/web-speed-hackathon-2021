import ja from 'date-fns/locale/ja';
import format from 'date-fns/esm/format';
import parseISO from 'date-fns/esm/parseISO';
import formatISO from 'date-fns/esm/formatISO';

export function formatDate(date) {
  return format(parseISO(date), 'YoModo', { locale: ja });
}

export function formatDateToISO(date) {
  return formatISO(parseISO(date));
}
