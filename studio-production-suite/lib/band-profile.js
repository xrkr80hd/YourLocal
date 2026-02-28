import { normalizeSocialLinksMap } from './social-platforms';

function parseJsonValue(value) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return value;
}

export function parseBandProfilePayload(value) {
  const parsed = parseJsonValue(value);

  if (Array.isArray(parsed)) {
    return {
      members: parsed,
      social_links: normalizeSocialLinksMap({}),
    };
  }

  if (parsed && typeof parsed === 'object') {
    const members = Array.isArray(parsed.members)
      ? parsed.members
      : Array.isArray(parsed.members_json)
        ? parsed.members_json
        : [];

    const socialInput = parsed.social_links || parsed.socials || {};

    return {
      members,
      social_links: normalizeSocialLinksMap(socialInput),
    };
  }

  return {
    members: [],
    social_links: normalizeSocialLinksMap({}),
  };
}

export function serializeBandProfilePayload({ members, social_links }) {
  return {
    members: Array.isArray(members) ? members : [],
    social_links: normalizeSocialLinksMap(social_links),
  };
}
