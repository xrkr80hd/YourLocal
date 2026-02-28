export function formatDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function stripHtml(text) {
  return String(text || '').replace(/<[^>]*>/g, '').trim();
}

export function truncate(text, max = 340) {
  const input = String(text || '');

  if (input.length <= max) {
    return input;
  }

  return `${input.slice(0, Math.max(0, max - 1)).trimEnd()}...`;
}
