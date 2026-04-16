import assert from "node:assert/strict";
import test from "node:test";
import {
  getEpisodeBySlug,
  getStaticCourseRouteParams,
  getStaticLocaleParams,
} from "@/lib/course-content";

test("static locale params are generated in priority order", () => {
  assert.deepEqual(getStaticLocaleParams(), [
    { locale: "ru" },
    { locale: "uz" },
    { locale: "en" },
  ]);
});

test("static course route params cover all locales for the first episode", () => {
  assert.deepEqual(getStaticCourseRouteParams(), [
    {
      locale: "ru",
      courseSlug: "digital-culture-bank",
      videoSlug: "episode-1-data-foundation",
    },
    {
      locale: "uz",
      courseSlug: "digital-culture-bank",
      videoSlug: "episode-1-data-foundation",
    },
    {
      locale: "en",
      courseSlug: "digital-culture-bank",
      videoSlug: "episode-1-data-foundation",
    },
  ]);
});

test("Uzbek and English users receive translated metadata plus a Russian-content notice", () => {
  const uzbekEpisode = getEpisodeBySlug(
    "uz",
    "digital-culture-bank",
    "episode-1-data-foundation",
  );
  const englishEpisode = getEpisodeBySlug(
    "en",
    "digital-culture-bank",
    "episode-1-data-foundation",
  );

  assert.equal(
    uzbekEpisode?.title,
    "1-son — Ma'lumotlar bank faoliyatining asosi",
  );
  assert.equal(
    englishEpisode?.title,
    "Episode 1 — Data as the Foundation of Banking Operations",
  );
  assert.equal(uzbekEpisode?.contentLocale, "ru");
  assert.equal(englishEpisode?.contentLocale, "ru");
  assert.match(uzbekEpisode?.localeNotice ?? "", /rus/i);
  assert.match(
    englishEpisode?.localeNotice ?? "",
    /currently available in Russian/i,
  );
});

test("invalid course or video slug returns null", () => {
  assert.equal(
    getEpisodeBySlug("ru", "missing-course", "episode-1-data-foundation"),
    null,
  );
  assert.equal(
    getEpisodeBySlug("ru", "digital-culture-bank", "missing-video"),
    null,
  );
});
