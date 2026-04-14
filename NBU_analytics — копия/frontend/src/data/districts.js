export const districts = [
  { key: 'fargona_city', population: 302.8, active: false },
  { key: 'margilon_city', population: 245.2, active: true },
  { key: 'qoqon_city', population: 259.7, active: false },
  { key: 'oltiariq', population: 221.4, active: false },
  { key: 'rishton', population: 210.6, active: false },
  { key: 'ozbekiston', population: 205.1, active: false },
  { key: 'beshariq', population: 198.2, active: false },
  { key: 'uchkoprik', population: 189.5, active: false },
  { key: 'buvayda', population: 182.3, active: false },
  { key: 'toshloq', population: 178.4, active: false },
  { key: 'quvasoy_city', population: 96.4, active: false },
]

export const kpis = [
  { key: 'population', value: '3.9 mln', delta: '+1.2%', icon: 'groups', tone: 'positive' },
  { key: 'gdpGrowth', value: '8.7%', delta: '+8.7%', icon: 'trending_up', tone: 'positive' },
  { key: 'exports', value: '$1.2 mlrd', delta: 'Target', icon: 'payments', tone: 'positive' },
  { key: 'mahallas', value: '1,248', delta: 'Total', icon: 'location_city', tone: 'neutral' },
]

export const economicBars = [
  { labelKey: 'home.cards.industry', value: '$420 mln', percent: 85, color: 'bg-primary' },
  { labelKey: 'home.cards.agriculture', value: '$380 mln', percent: 70, color: 'bg-primary-container' },
  { labelKey: 'home.cards.services', value: '$220 mln', percent: 45, color: 'bg-primary opacity-60' },
]

export const populationBars = [
  { labelKey: 'home.cards.employed', value: '2.1 mln', percent: 92, color: 'bg-tertiary' },
  { labelKey: 'home.cards.selfEmployed', value: '850k', percent: 65, color: 'bg-tertiary-container' },
  { labelKey: 'home.cards.education', value: '120k', percent: 30, color: 'bg-tertiary opacity-60' },
]

export const bankBars = [
  { labelKey: 'home.cards.credits', value: '8.4 trln', percent: 78, color: 'bg-primary-container' },
  { labelKey: 'home.cards.newBusiness', value: '4.2 ming', percent: 55, color: 'bg-primary' },
  { labelKey: 'home.cards.exporters', value: '850 ta', percent: 40, color: 'bg-secondary' },
]

export const tools = [
  { key: 'fincontrol', icon: 'account_balance_wallet', accent: 'bg-primary', to: '/tools/fincontrol', featured: true },
  { key: 'forecast', icon: 'query_stats', accent: 'bg-primary' },
  { key: 'credit', icon: 'credit_score', accent: 'bg-tertiary' },
  { key: 'market', icon: 'insights', accent: 'bg-secondary' },
  { key: 'risk', icon: 'gpp_maybe', accent: 'bg-error' },
]
