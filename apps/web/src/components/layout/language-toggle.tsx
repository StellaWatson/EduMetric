'use client';

import { Languages } from 'lucide-react';
import { useI18n } from '@/lib/i18n/store';
import { LANG_LABELS, type Lang } from '@/lib/i18n/dictionary';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const lang = useI18n((s) => s.lang);
  const setLang = useI18n((s) => s.setLang);
  const t = useI18n((s) => s.t);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('topbar.language')} title={t('topbar.language')}>
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('topbar.language')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.entries(LANG_LABELS) as [Lang, string][]).map(([code, label]) => (
          <DropdownMenuItem key={code} onClick={() => setLang(code)}>
            <span className={`mr-2 inline-block w-4 ${lang === code ? 'text-primary' : 'text-transparent'}`}>✓</span>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
