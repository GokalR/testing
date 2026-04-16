import assert from "node:assert/strict";
import test from "node:test";
import {
  defaultLocale,
  getCourseSeries,
  isSupportedLocale,
  resolveLocale,
} from "@/lib/course-content";

test("resolveLocale falls back to Russian when locale is unsupported", () => {
  assert.equal(defaultLocale, "ru");
  assert.equal(isSupportedLocale("ru"), true);
  assert.equal(isSupportedLocale("uz"), true);
  assert.equal(isSupportedLocale("en"), true);
  assert.equal(isSupportedLocale("fr"), false);
  assert.equal(resolveLocale("uz"), "uz");
  assert.equal(resolveLocale("en"), "en");
  assert.equal(resolveLocale("fr"), "ru");
});

test("course metadata is translated while lesson content stays Russian-first", () => {
  const russianSeries = getCourseSeries("ru");
  const uzbekSeries = getCourseSeries("uz");
  const englishSeries = getCourseSeries("en");

  assert.equal(russianSeries.slug, "digital-culture-bank");
  assert.equal(russianSeries.title, "Цифровая культура банка");
  assert.equal(uzbekSeries.title, "Bankning raqamli madaniyati");
  assert.equal(englishSeries.title, "Digital Culture of the Bank");
  assert.equal(
    uzbekSeries.episodes[0].title,
    "1-son — Ma'lumotlar bank faoliyatining asosi",
  );
  assert.equal(
    englishSeries.episodes[0].title,
    "Episode 1 — Data as the Foundation of Banking Operations",
  );
  assert.equal(uzbekSeries.episodes[0].contentLocale, "ru");
  assert.equal(englishSeries.episodes[0].contentLocale, "ru");
  assert.match(uzbekSeries.episodes[0].localeNotice ?? "", /rus/i);
  assert.match(
    englishSeries.episodes[0].localeNotice ?? "",
    /currently available in Russian/i,
  );
});
