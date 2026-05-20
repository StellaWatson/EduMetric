'use client';

import { useRouter } from 'next/navigation';
import { Bell, LogOut, Moon, Search, Settings, Sun, User as UserIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/api/auth';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguageToggle } from './language-toggle';
import { useT } from '@/lib/i18n/store';

export function Topbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const t = useT();

  function handleLogout() {
    authApi.logout();
    clear();
    window.location.assign('/login');
  }

  return (
    <header className="h-14 border-b bg-card/50 backdrop-blur sticky top-0 z-30 flex items-center px-4 md:px-6">
      <div className="relative hidden sm:block max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder={t('topbar.search')}
          className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <LanguageToggle />
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('topbar.theme')}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="hidden h-4 w-4 dark:block" />
        </Button>

        <Button variant="ghost" size="icon" aria-label={t('topbar.notifications')}>
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted">
              <Avatar fallback={user?.fullName ?? '?'} size="sm" src={user?.avatar ?? undefined} />
              <span className="hidden text-sm font-medium md:inline">{user?.fullName ?? 'Guest'}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user?.email ?? 'Not signed in'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/account/profile')}>
              <UserIcon className="mr-2 h-4 w-4" /> {t('topbar.account')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/account/settings')}>
              <Settings className="mr-2 h-4 w-4" /> {t('topbar.settings')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> {t('topbar.signout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
