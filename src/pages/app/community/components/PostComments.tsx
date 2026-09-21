import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '@/components/base/Avatar';
import Spinner from '@/components/base/Spinner';
import { useComments } from '@/hooks/useCommunity';

export default function PostComments({ postId }: { postId: string }) {
  const { t } = useTranslation();
  const { comments, loading, addComment } = useComments(postId);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    const value = draft.trim();
    if (!value) return;
    setSending(true);
    try {
      await addComment(value);
      setDraft('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-4 space-y-3 border-t border-background-200 pt-4">
      {loading ? (
        <div className="flex justify-center py-3 text-foreground-500">
          <span className="w-5 h-5 flex items-center justify-center">
            <Spinner />
          </span>
        </div>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-2.5">
            <Avatar name={comment.author?.full_name} url={comment.author?.avatar_url} size={28} />
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground-900">
                {comment.author?.full_name || t('common.none')}
              </p>
              <p className="text-sm text-foreground-700">{comment.body}</p>
            </div>
          </div>
        ))
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t('community.commentPlaceholder')}
          className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={sending || !draft.trim()}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md bg-secondary-500 px-3 py-2 text-sm font-medium text-background-50 hover:bg-secondary-600 disabled:opacity-50"
        >
          {sending ? <Spinner /> : <i className="ri-reply-line"></i>}
          {t('community.comment')}
        </button>
      </div>
    </div>
  );
}