import { AnalyticsIcon } from './svg/AnalyticsIcon';
import { HistoryIcon } from './svg/HistoryIcon';
import { HomeIcon } from './svg/HomeIcon';
import { LogTestIcon } from './svg/LogTestIcon';
import { PersonIcon } from './svg/PersonIcon';
import { SLogoIcon } from './svg/SLogoIcon';

export const IconRegistry = {
  home: HomeIcon,
  history: HistoryIcon,
  analytics: AnalyticsIcon,
  'log-test': LogTestIcon,
  person: PersonIcon,
  's-logo': SLogoIcon,
} as const;

export type RegisteredIconName = keyof typeof IconRegistry; 