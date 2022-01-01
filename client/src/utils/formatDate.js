import ja from 'date-fns/locale/ja';
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { formatISO } from 'date-fns/formatISO';

export function formatDate(date) {
  return format(parseISO(date), 'YoModo', { locale: ja });
}

export function formatDateToISO(date) {
  return formatISO(parseISO(date));
}
