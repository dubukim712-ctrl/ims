import {
  BookOpen,
  Boxes,
  CupSoda,
  LayoutDashboard,
  PackagePlus,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory', shortLabel: 'Stock', icon: Boxes },
  { to: '/stock-in', label: 'Stock In', shortLabel: 'Restock', icon: PackagePlus },
  { to: '/usage', label: 'Daily Usage', shortLabel: 'Usage', icon: CupSoda },
  { to: '/recipes', label: 'Recipes & Logs', shortLabel: 'Recipes', icon: BookOpen },
];
