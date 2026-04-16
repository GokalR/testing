import assert from "node:assert/strict";
import test from "node:test";
import {
  getAuthHref,
  getLocaleFromCookieValue,
  getLocaleFromPathname,
  normalizeCallbackUrl,
} from "@/lib/auth/auth-routing";
import {
  getLoginCopy,
  getRegisterCopy,
  getRegisterErrorMessage,
} from "@/lib/auth/auth-copy";

test("auth routing helpers resolve locale from cookie and pathname", () => {
  assert.equal(getLocaleFromCookieValue("uz"), "uz");
  assert.equal(getLocaleFromCookieValue(undefined), "ru");
  assert.equal(getLocaleFromPathname("/en/login"), "en");
  assert.equal(getLocaleFromPathname("/dashboard"), null);
});

test("auth href builder preserves locale and callbackUrl", () => {
  assert.equal(getAuthHref("ru", "login"), "/ru/login");
  assert.equal(
    getAuthHref("uz", "register", "/dashboard"),
    "/uz/register?callbackUrl=%2Fdashboard",
  );
});

test("login and register copy are localized for all supported locales", () => {
  assert.equal(getLoginCopy("ru").title, "Вход в EduPulse");
  assert.equal(getLoginCopy("uz").submitIdle, "Kirish");
  assert.equal(getRegisterCopy("en").title, "Create Account");
  assert.equal(
    getRegisterErrorMessage("ru", "email_taken"),
    "Этот email уже зарегистрирован.",
  );
});


test("callbackUrl normalization rejects external redirects", () => {
  assert.equal(normalizeCallbackUrl("/dashboard"), "/dashboard");
  assert.equal(normalizeCallbackUrl("https://evil.example"), undefined);
  assert.equal(normalizeCallbackUrl("//evil.example"), undefined);
});
