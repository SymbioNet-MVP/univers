import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Spinner from '@/components/base/Spinner';
import { useAuth } from '@/hooks/useAuth';
import type { PostType } from '@/types/db';

interface PostComposerProps {
  onSubmit: (payload: { type: PostType; title: string; body: string; field: string }) => Promise<void>;
  onClose: () => void;
}

const TYPE_OPTIONS: { value: PostType; key: string }[] = [
  { value: 'Question', key: 'question' },
  { value: 'Study Goal', key: 'studyGoal' },
  { value: 'Looking for Buddy', key: 'lookingForBuddy' },
  { value: 'Resource Share', key: 'resourceShare' },
];

export default function PostComposer({ onSubmit, onClose }: PostComposerProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [type, setType] = useState<PostType>('Question');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [field, setField] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!user) return;
    if (!title.trim() || !body.trim()) {
      setError(t('community.postBody'));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ type, title, body, field });
      onClose();
    } catch (err) {
      console.error(err);
      setError(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-foreground-950">
          {t('community.newPost')}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('community.cancel')}
          className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-md text-foreground-500 hover:bg-background-100"
        >
          <i className="ri-close-line text-lg"></i>
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setType(option.value)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              type === option.value
                ? 'border-primary-300 bg-primary-100 text-primary-700'
                : 'border-background-200 bg-background-50 text-foreground-600 hover:bg-background-100'
            }`}
          >
            {t(`community.types.${option.key}`)}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t('community.postTitle')}
          className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
        <textarea
          rows={4}
          maxLength={500}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={t('community.postBody')}
          className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
        <input
          type="text"
          value={field}
          onChange={(event) => setField(event.target.value)}
          placeholder={t('community.fieldPlaceholder')}
          className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {error && <p className="mt-3 text-xs text-accent-700">{error}</p>}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer whitespace-nowrap rounded-md border border-background-300 px-4 py-2 text-sm font-medium text-foreground-700 hover:bg-background-100"
        >
          {t('community.cancel')}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-background-50 hover:bg-primary-600 disabled:opacity-60"
        >
          {saving ? <Spinner /> : <i className="ri-send-plane-line"></i>}
          {t('community.publish')}
        </button>
      </div>
    </div>
  );
}