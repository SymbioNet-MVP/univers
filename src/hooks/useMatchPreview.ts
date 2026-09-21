import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface RawPreview {
  count?: number;
  sample_names?: string[];
}

export interface MatchPreview {
  count: number;
  names: string[];
  loading: boolean;
}

interface PreviewInput {
  field: string;
  level: string;
  institutionId: string | null;
  interests: string;
}

/**
 * Live, read-only preview of how many learners already match the (partial)
 * profile the user is filling in. It gives value BEFORE the work is finished,
 * which is what keeps people in the onboarding funnel.
 */
export function useMatchPreview({
  field,
  level,
  institutionId,
  interests,
}: PreviewInput): MatchPreview {
  const [state, setState] = useState<MatchPreview>({ count: 0, names: [], loading: true });

  useEffect(() => {
    let active = true;
    setState((prev) => ({ ...prev, loading: true }));

    const timer = setTimeout(async () => {
      try {
        const parsed = interests
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);

        const { data, error } = await supabase.rpc('preview_match_count', {
          p_field: field.trim() || null,
          p_level: level || null,
          p_institution_id: institutionId,
          p_interests: parsed.length > 0 ? parsed : null,
        });
        if (error) throw error;
        const raw = (data as RawPreview) ?? {};
        if (active) {
          setState({
            count: raw.count ?? 0,
            names: raw.sample_names ?? [],
            loading: false,
          });
        }
      } catch {
        if (active) setState((prev) => ({ ...prev, loading: false }));
      }
    }, 450);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [field, level, institutionId, interests]);

  return state;
}