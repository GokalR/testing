export interface DistrictData {
  id: string;
  name: string;
  score: number;
  population: number;
  businesses: number;
  competition: "низкая" | "средняя" | "высокая";
  verdict: string;
}

/**
 * 14 districts of Samarkand region with opportunity scores
 * for the "food market" (Продуктовый рынок) business type.
 */
export const SAMARKAND_DISTRICTS: DistrictData[] = [
  { id: "samarkand",   name: "Самарканд ш.",  score: 45, population: 551_700, businesses: 340, competition: "высокая", verdict: "Перенасыщенный рынок в городе" },
  { id: "bulungur",    name: "Булунғур",      score: 78, population: 89_000,  businesses: 12,  competition: "низкая",  verdict: "Отличный потенциал для входа" },
  { id: "ishtixon",    name: "Иштихон",       score: 72, population: 156_000, businesses: 28,  competition: "средняя", verdict: "Хорошие перспективы роста" },
  { id: "jomboy",      name: "Жомбой",        score: 85, population: 201_000, businesses: 15,  competition: "низкая",  verdict: "Высокий спрос, мало конкурентов" },
  { id: "kattakurgan", name: "Каттақўрғон",   score: 52, population: 112_000, businesses: 45,  competition: "высокая", verdict: "Насыщенный рынок" },
  { id: "narpay",      name: "Нарпай",        score: 68, population: 178_000, businesses: 22,  competition: "средняя", verdict: "Средний потенциал" },
  { id: "nurobod",     name: "Нуробод",       score: 81, population: 134_000, businesses: 8,   competition: "низкая",  verdict: "Высокий спрос на продукты" },
  { id: "oqdaryo",     name: "Оқдарё",        score: 74, population: 98_000,  businesses: 14,  competition: "низкая",  verdict: "Хорошие перспективы" },
  { id: "paxtachi",    name: "Пахтачи",       score: 61, population: 145_000, businesses: 32,  competition: "средняя", verdict: "Умеренный потенциал" },
  { id: "payariq",     name: "Пайариқ",       score: 88, population: 167_000, businesses: 6,   competition: "низкая",  verdict: "Идеальные условия для старта" },
  { id: "pastdargom",  name: "Пастдарғом",    score: 71, population: 243_000, businesses: 35,  competition: "средняя", verdict: "Выше среднего" },
  { id: "toyloq",      name: "Тайлоқ",        score: 55, population: 87_000,  businesses: 18,  competition: "средняя", verdict: "Средний потенциал" },
  { id: "urgut",       name: "Ургут",         score: 64, population: 312_000, businesses: 48,  competition: "высокая", verdict: "Большой рынок, много конкурентов" },
  { id: "koshrabot",   name: "Қўшработ",      score: 76, population: 95_000,  businesses: 10,  competition: "низкая",  verdict: "Мало конкурентов" },
];
