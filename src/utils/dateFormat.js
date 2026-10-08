// Safe date helpers. Old notes may have no timestamp at all, so nothing here throws.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Accepts a Firestore Timestamp, Date, number (ms), or {seconds}. Returns a Date or null.
export function toDate(value) {
  if (!value) return null;
  try {
    if (typeof value.toDate === 'function') return value.toDate();
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    if (typeof value === 'number') {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }
    if (typeof value.seconds === 'number') return new Date(value.seconds * 1000);
  } catch (e) {
    return null;
  }
  return null;
}

// Example: "6 Oct, 1:54 PM" (adds the year only for older years). Returns '' if there is no date.
export function formatDateTime(value) {
  const d = toDate(value);
  if (!d) return '';
  const hours24 = d.getHours();
  const hours = hours24 % 12 || 12;
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const year = d.getFullYear() !== new Date().getFullYear() ? ` ${d.getFullYear()}` : '';
  return `${d.getDate()} ${MONTHS[d.getMonth()]}${year}, ${hours}:${minutes} ${period}`;
}

// Milliseconds for sorting. Missing dates become 0 so they go to the bottom.
export function getTimeValue(value) {
  const d = toDate(value);
  return d ? d.getTime() : 0;
}