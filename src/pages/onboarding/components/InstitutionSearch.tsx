import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import type { Institution } from '@/types/db';

interface InstitutionSearchProps {
  selectedId: string | null;
  text: string;
  onChangeText: (text: string) => void;
  onSelect: (institution: Institution | null) => void;
}

export default function InstitutionSearch({
  selectedId,
  text,
  onChangeText,
  onSelect,
}: InstitutionSearchProps) {
  const { t } = useTranslation();
  const [results, setResults] = useState<Institution[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const skipRef = useRef(false);

  useEffect(() => {
    if (skipRef.current) {
      skipRef.current = false;
      return undefined;
    }
    if (selectedId) return undefined;
    const q = text.trim();
    if (q.length < 2) {
      setResults([]);
      return undefined;
    }

    let active = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const { data } = await supabase
          .from('institutions')
          .select('*')
          .ilike('name', `%${q}%`)
          .order('verified', { ascending: false })
          .limit(8);
        if (active) {
          setResults((data as Institution[]) ?? []);
          setOpen(true);
        }
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [text, selectedId]);

  const handleSelect = (institution: Institution) => {
    skipRef.current = true;
    onSelect(institution);
    setOpen(false);
    setResults([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={text}
        placeholder={t('onboarding.institutionPlaceholder')}
        onChange={(event) => {
          onChangeText(event.target.value);
          if (selectedId) onSelect(null);
        }}
        onFocus={() => results.length > 0 && setOpen(true)}
        className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 pr-9 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-foreground-400">
        {selectedId ? (
          <i className="ri-check-line text-primary-600"></i>
        ) : loading ? (
          <i className="ri-loader-4-line animate-spin"></i>
        ) : (
          <i className="ri-search-line"></i>
        )}
      </span>

      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-md border border-background-200 bg-background-50 py-1 shadow-none">
          {results.map((institution) => (
            <li key={institution.id}>
              <button
                type="button"
                onClick={() => handleSelect(institution)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-background-100"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground-950">
                    {institution.name}
                  </span>
                  <span className="block truncate text-xs text-foreground-500">
                    {institution.country} · {institution.type}
                  </span>
                </span>
                {institution.verified && (
                  <i className="ri-verified-badge-fill shrink-0 text-primary-600"></i>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}