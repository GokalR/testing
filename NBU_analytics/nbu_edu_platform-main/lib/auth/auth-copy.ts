import { getLocalizedText } from "@/lib/course-content/locales";
import type { LocalizedText, SupportedLocale } from "@/lib/course-content/types";

const loginTitle: LocalizedText = {
  ru: "Вход в EduPulse",
  uz: "EduPulse'ga kirish",
  en: "Welcome Back",
};

const loginSubtitle: LocalizedText = {
  ru: "Войдите, чтобы продолжить обучение.",
  uz: "Ta'limni davom ettirish uchun tizimga kiring.",
  en: "Sign in to continue your learning journey",
};

const registerTitle: LocalizedText = {
  ru: "Создать аккаунт",
  uz: "Akkaunt yaratish",
  en: "Create Account",
};

const registerSubtitle: LocalizedText = {
  ru: "Начните обучение на платформе EduPulse.",
  uz: "EduPulse platformasida o'qishni boshlang.",
  en: "Start your learning journey today",
};

const fullNameLabel: LocalizedText = {
  ru: "Полное имя",
  uz: "To'liq ism",
  en: "Full name",
};

const fullNamePlaceholder: LocalizedText = {
  ru: "Иван Иванов",
  uz: "Ali Valiyev",
  en: "Jane Smith",
};

const emailLabel: LocalizedText = {
  ru: "Email",
  uz: "Email",
  en: "Email address",
};

const emailPlaceholder: LocalizedText = {
  ru: "you@example.com",
  uz: "you@example.com",
  en: "you@example.com",
};

const passwordLabel: LocalizedText = {
  ru: "Пароль",
  uz: "Parol",
  en: "Password",
};

const passwordHint: LocalizedText = {
  ru: "минимум 6 символов",
  uz: "kamida 6 ta belgi",
  en: "min. 6 characters",
};

const passwordPlaceholder: LocalizedText = {
  ru: "••••••••",
  uz: "••••••••",
  en: "••••••••",
};

const confirmPasswordLabel: LocalizedText = {
  ru: "Подтвердите пароль",
  uz: "Parolni tasdiqlang",
  en: "Confirm password",
};

const signInIdle: LocalizedText = {
  ru: "Войти",
  uz: "Kirish",
  en: "Sign In",
};

const signInLoading: LocalizedText = {
  ru: "Выполняется вход...",
  uz: "Kirilmoqda...",
  en: "Signing in...",
};

const createAccountIdle: LocalizedText = {
  ru: "Создать аккаунт",
  uz: "Akkaunt yaratish",
  en: "Create Account",
};

const createAccountLoading: LocalizedText = {
  ru: "Создание аккаунта...",
  uz: "Akkaunt yaratilmoqda...",
  en: "Creating account...",
};

const noAccountPrompt: LocalizedText = {
  ru: "Нет аккаунта?",
  uz: "Akkauntingiz yo'qmi?",
  en: "Don't have an account?",
};

const registerLinkLabel: LocalizedText = {
  ru: "Зарегистрироваться",
  uz: "Ro'yxatdan o'tish",
  en: "Register",
};

const hasAccountPrompt: LocalizedText = {
  ru: "Уже есть аккаунт?",
  uz: "Akkauntingiz bormi?",
  en: "Already have an account?",
};

const loginLinkLabel: LocalizedText = {
  ru: "Войти",
  uz: "Kirish",
  en: "Sign in",
};

const invalidCredentials: LocalizedText = {
  ru: "Неверный email или пароль. Попробуйте снова.",
  uz: "Email yoki parol noto'g'ri. Qayta urinib ko'ring.",
  en: "Invalid email or password. Please try again.",
};

const genericAuthError: LocalizedText = {
  ru: "Что-то пошло не так. Попробуйте снова.",
  uz: "Nimadir xato ketdi. Qayta urinib ko'ring.",
  en: "Something went wrong. Please try again.",
};

const autoLoginFailed: LocalizedText = {
  ru: "Аккаунт создан, но вход не выполнен. Пожалуйста, войдите вручную.",
  uz: "Akkaunt yaratildi, lekin kirish amalga oshmadi. Iltimos, qo'lda kiring.",
  en: "Account created, but sign-in failed. Please go to login.",
};

const fullNameRequired: LocalizedText = {
  ru: "Укажите полное имя.",
  uz: "To'liq ismingizni kiriting.",
  en: "Full name is required.",
};

const emailRequired: LocalizedText = {
  ru: "Укажите email.",
  uz: "Email kiriting.",
  en: "Email is required.",
};

const invalidEmail: LocalizedText = {
  ru: "Введите корректный email.",
  uz: "To'g'ri email kiriting.",
  en: "Please enter a valid email address.",
};

const passwordTooShort: LocalizedText = {
  ru: "Пароль должен содержать не менее 6 символов.",
  uz: "Parol kamida 6 ta belgidan iborat bo'lishi kerak.",
  en: "Password must be at least 6 characters.",
};

const passwordsDoNotMatch: LocalizedText = {
  ru: "Пароли не совпадают.",
  uz: "Parollar mos emas.",
  en: "Passwords do not match.",
};

const missingFields: LocalizedText = {
  ru: "Заполните имя, email и пароль.",
  uz: "Ism, email va parolni to'ldiring.",
  en: "Email, password, and full name are required.",
};

const emailTaken: LocalizedText = {
  ru: "Этот email уже зарегистрирован.",
  uz: "Bu email allaqachon ro'yxatdan o'tgan.",
  en: "Email already registered.",
};

const registrationFailed: LocalizedText = {
  ru: "Не удалось завершить регистрацию.",
  uz: "Ro'yxatdan o'tishni yakunlab bo'lmadi.",
  en: "Registration failed. Please try again.",
};

export type RegisterErrorCode =
  | "missing_fields"
  | "invalid_email"
  | "password_too_short"
  | "email_taken"
  | "registration_failed";

export interface LoginCopy {
  title: string;
  subtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submitIdle: string;
  submitLoading: string;
  footerPrompt: string;
  footerLinkLabel: string;
  invalidCredentials: string;
  genericError: string;
}

export interface RegisterCopy {
  title: string;
  subtitle: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordHint: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  submitIdle: string;
  submitLoading: string;
  footerPrompt: string;
  footerLinkLabel: string;
  genericError: string;
  autoLoginFailed: string;
  validation: {
    fullNameRequired: string;
    emailRequired: string;
    invalidEmail: string;
    passwordTooShort: string;
    passwordsDoNotMatch: string;
  };
}

export function getLoginCopy(locale: SupportedLocale): LoginCopy {
  return {
    title: getLocalizedText(loginTitle, locale),
    subtitle: getLocalizedText(loginSubtitle, locale),
    emailLabel: getLocalizedText(emailLabel, locale),
    emailPlaceholder: getLocalizedText(emailPlaceholder, locale),
    passwordLabel: getLocalizedText(passwordLabel, locale),
    passwordPlaceholder: getLocalizedText(passwordPlaceholder, locale),
    submitIdle: getLocalizedText(signInIdle, locale),
    submitLoading: getLocalizedText(signInLoading, locale),
    footerPrompt: getLocalizedText(noAccountPrompt, locale),
    footerLinkLabel: getLocalizedText(registerLinkLabel, locale),
    invalidCredentials: getLocalizedText(invalidCredentials, locale),
    genericError: getLocalizedText(genericAuthError, locale),
  };
}

export function getRegisterCopy(locale: SupportedLocale): RegisterCopy {
  return {
    title: getLocalizedText(registerTitle, locale),
    subtitle: getLocalizedText(registerSubtitle, locale),
    fullNameLabel: getLocalizedText(fullNameLabel, locale),
    fullNamePlaceholder: getLocalizedText(fullNamePlaceholder, locale),
    emailLabel: getLocalizedText(emailLabel, locale),
    emailPlaceholder: getLocalizedText(emailPlaceholder, locale),
    passwordLabel: getLocalizedText(passwordLabel, locale),
    passwordHint: getLocalizedText(passwordHint, locale),
    passwordPlaceholder: getLocalizedText(passwordPlaceholder, locale),
    confirmPasswordLabel: getLocalizedText(confirmPasswordLabel, locale),
    submitIdle: getLocalizedText(createAccountIdle, locale),
    submitLoading: getLocalizedText(createAccountLoading, locale),
    footerPrompt: getLocalizedText(hasAccountPrompt, locale),
    footerLinkLabel: getLocalizedText(loginLinkLabel, locale),
    genericError: getLocalizedText(genericAuthError, locale),
    autoLoginFailed: getLocalizedText(autoLoginFailed, locale),
    validation: {
      fullNameRequired: getLocalizedText(fullNameRequired, locale),
      emailRequired: getLocalizedText(emailRequired, locale),
      invalidEmail: getLocalizedText(invalidEmail, locale),
      passwordTooShort: getLocalizedText(passwordTooShort, locale),
      passwordsDoNotMatch: getLocalizedText(passwordsDoNotMatch, locale),
    },
  };
}

export function getRegisterErrorMessage(
  locale: SupportedLocale,
  code: RegisterErrorCode,
): string {
  switch (code) {
    case "missing_fields":
      return getLocalizedText(missingFields, locale);
    case "invalid_email":
      return getLocalizedText(invalidEmail, locale);
    case "password_too_short":
      return getLocalizedText(passwordTooShort, locale);
    case "email_taken":
      return getLocalizedText(emailTaken, locale);
    case "registration_failed":
    default:
      return getLocalizedText(registrationFailed, locale);
  }
}
