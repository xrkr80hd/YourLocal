export const ADMIN_SESSION_COOKIE = 'xrkr_admin_session';

function getEnv(name, fallback = '') {
  return String(process.env[name] || fallback || '').trim();
}

function parseCredentialPair(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return null;
  }

  const separatorIndex = raw.indexOf(':');
  if (separatorIndex <= 0) {
    return null;
  }

  const username = raw.slice(0, separatorIndex).trim();
  const password = raw.slice(separatorIndex + 1).trim();

  if (!username || !password) {
    return null;
  }

  return { username, password };
}

function getAdminAccounts() {
  const multi = getEnv('ADMIN_LOGIN_CREDENTIALS');
  const parsed = multi
    .split(',')
    .map((entry) => parseCredentialPair(entry))
    .filter(Boolean);

  if (parsed.length) {
    return parsed;
  }

  const fallback = parseCredentialPair(`${getEnv('ADMIN_LOGIN_USERNAME', 'admin')}:${getEnv('ADMIN_LOGIN_PASSWORD')}`);
  return fallback ? [fallback] : [];
}

export function getAdminConfig() {
  return {
    accounts: getAdminAccounts(),
    sessionToken: getEnv('ADMIN_SESSION_TOKEN'),
  };
}

export function isAdminConfigReady() {
  const { accounts, sessionToken } = getAdminConfig();
  return Boolean(accounts.length && sessionToken);
}

export function isAdminSessionValid(cookieValue) {
  const { sessionToken } = getAdminConfig();
  return Boolean(sessionToken) && cookieValue === sessionToken;
}

export function areAdminCredentialsValid(username, password) {
  const config = getAdminConfig();
  if (!config.accounts.length || !config.sessionToken) {
    return false;
  }

  const safeUser = String(username || '').trim();
  const safePass = String(password || '');

  return config.accounts.some((account) => account.username === safeUser && account.password === safePass);
}
