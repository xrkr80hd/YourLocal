export function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

export function clampText(value, max = 255) {
  return String(value || '').trim().slice(0, max);
}

export function toBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  const lowered = String(value || '').trim().toLowerCase();
  return lowered === '1' || lowered === 'true' || lowered === 'yes' || lowered === 'on';
}

export function toInteger(value, fallback = 0, min = 0, max = 999999) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
}

export function isValidMediaUrl(value) {
  const url = String(value || '').trim();
  if (!url) {
    return true;
  }

  return /^(https?:\/\/|\/)/i.test(url);
}
