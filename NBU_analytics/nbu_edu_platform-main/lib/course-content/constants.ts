/**
 * Deterministic DB IDs for the static course content.
 * These match the values seeded into the database so the
 * locale-based pages can look up enrollment status.
 */
export const DIGITAL_CULTURE_COURSE_ID = "00000000-0000-4000-a000-000000000001";
export const DIGITAL_CULTURE_VIDEO_IDS = {
  1: "00000000-0000-4000-a000-000000000011",
  2: "00000000-0000-4000-a000-000000000012",
  3: "00000000-0000-4000-a000-000000000013",
  4: "00000000-0000-4000-a000-000000000014",
  5: "00000000-0000-4000-a000-000000000015",
} as const;

/** Map static course slug → DB course UUID */
export const COURSE_SLUG_TO_DB_ID: Record<string, string> = {
  "digital-culture-bank": DIGITAL_CULTURE_COURSE_ID,
};

/** Map DB course UUID → static course slug */
export const DB_ID_TO_COURSE_SLUG: Record<string, string> = {
  [DIGITAL_CULTURE_COURSE_ID]: "digital-culture-bank",
};

/** Map DB video UUID → static episode slug */
export const DB_VIDEO_ID_TO_EPISODE_SLUG: Record<string, string> = {
  [DIGITAL_CULTURE_VIDEO_IDS[1]]: "episode-1-data-foundation",
  [DIGITAL_CULTURE_VIDEO_IDS[2]]: "episode-2-data-warehouse",
  [DIGITAL_CULTURE_VIDEO_IDS[3]]: "episode-3-data-types",
  [DIGITAL_CULTURE_VIDEO_IDS[4]]: "episode-4-data-journey",
  [DIGITAL_CULTURE_VIDEO_IDS[5]]: "episode-5-data-quality",
};

/** Map static episode slug → DB video UUID */
export const EPISODE_SLUG_TO_DB_VIDEO_ID: Record<string, string> = {
  "episode-1-data-foundation": DIGITAL_CULTURE_VIDEO_IDS[1],
  "episode-2-data-warehouse": DIGITAL_CULTURE_VIDEO_IDS[2],
  "episode-3-data-types": DIGITAL_CULTURE_VIDEO_IDS[3],
  "episode-4-data-journey": DIGITAL_CULTURE_VIDEO_IDS[4],
  "episode-5-data-quality": DIGITAL_CULTURE_VIDEO_IDS[5],
};

/**
 * Resolve a URL param that can be either a slug or a UUID.
 * Returns { dbId, slug } or null if unrecognized.
 */
export function resolveCourseParam(param: string): {
  dbId: string;
  slug: string;
} | null {
  // Try slug → ID
  if (COURSE_SLUG_TO_DB_ID[param]) {
    return { dbId: COURSE_SLUG_TO_DB_ID[param], slug: param };
  }
  // Try ID → slug
  if (DB_ID_TO_COURSE_SLUG[param]) {
    return { dbId: param, slug: DB_ID_TO_COURSE_SLUG[param] };
  }
  // Unknown — treat as raw DB ID (no slug available)
  return { dbId: param, slug: param };
}

export function resolveVideoParam(param: string): {
  dbId: string;
  slug: string;
} | null {
  // Try slug → ID
  if (EPISODE_SLUG_TO_DB_VIDEO_ID[param]) {
    return { dbId: EPISODE_SLUG_TO_DB_VIDEO_ID[param], slug: param };
  }
  // Try ID → slug
  if (DB_VIDEO_ID_TO_EPISODE_SLUG[param]) {
    return { dbId: param, slug: DB_VIDEO_ID_TO_EPISODE_SLUG[param] };
  }
  // Unknown — treat as raw DB ID
  return { dbId: param, slug: param };
}
