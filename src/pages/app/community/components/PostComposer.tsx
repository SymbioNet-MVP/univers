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
    <div className="ui-card -mx-3 p-4 sm:mx-0 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground-950">
          {t('community.newPost')}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('community.cancel')}
          className="ui-icon-button h-9 w-9 cursor-pointer text-foreground-500"
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
            className={`cursor-pointer rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
              type === option.value
                ? 'border-primary-500 bg-primary-500 text-white shadow-sm'
                : 'border-background-300 bg-background-50 text-foreground-600 hover:bg-background-100'
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
          className="ui-input px-3.5 py-3 text-sm"
        />
        <textarea
          rows={4}
          maxLength={500}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={t('community.postBody')}
          className="ui-input resize-none px-3.5 py-3 text-sm leading-6"
        />
        <input
          type="text"
          value={field}
          onChange={(event) => setField(event.target.value)}
          placeholder={t('community.fieldPlaceholder')}
          className="ui-input px-3.5 py-3 text-sm"
        />
      </div>

      {error && <p className="mt-3 text-xs text-accent-700">{error}</p>}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer whitespace-nowrap rounded-full border border-background-300 px-4 py-2 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-100"
        >
          {t('community.cancel')}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="ui-primary-button cursor-pointer gap-2 whitespace-nowrap px-5 py-2 text-sm"
        >
          {saving ? <Spinner /> : <i className="ri-send-plane-line"></i>}
          {t('community.publish')}
        </button>
      </div>
    </div>
  );
}
