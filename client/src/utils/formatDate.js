import ja from 'date-fns/locale/ja';
import { format, parseISO, formatISO } from 'date-fns';

export function formatDate(date) {
  return format(parseISO(date), 'YoModo', { locale: ja });
}

export function formatDateToISO(date) {
  return formatISO(parseISO(date));
}
