import { Calendar, LayoutDashboard, List, Settings, WalletCards } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SidebarOption {
  name: string;
  icon: LucideIcon;
  path: string;
}

export const SideBarOptions: SidebarOption[] = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Scheduled Interview', icon: Calendar, path: '/scheduled-interview' },
  { name: 'All Interview', icon: List, path: '/all-interview' },
  { name: 'Billing', icon: WalletCards, path: '/billing' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];
