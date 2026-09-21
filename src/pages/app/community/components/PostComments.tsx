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
    <div className="space-y-4 border-t border-background-200 bg-background-100/60 px-4 py-4 sm:px-5">
      {loading ? (
        <div className="flex justify-center py-3 text-foreground-500">
          <span className="w-5 h-5 flex items-center justify-center">
            <Spinner />
          </span>
        </div>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-2.5">
            <Avatar name={comment.author?.full_name} url={comment.author?.avatar_url} size={30} />
            <div className="min-w-0 rounded-2xl rounded-tl-sm bg-background-50 px-3 py-2 shadow-sm">
              <p className="text-xs font-semibold text-foreground-900">
                {comment.author?.full_name || t('common.none')}
              </p>
              <p className="mt-0.5 break-words text-sm leading-5 text-foreground-700">{comment.body}</p>
            </div>
          </div>
        ))
      )}

      <div className="flex items-center gap-2 rounded-full border border-background-300 bg-background-50 p-1.5 pl-4 focus-within:border-primary-300 focus-within:shadow-[0_0_0_3px_oklch(var(--primary-100)/0.7)]">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t('community.commentPlaceholder')}
          className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-foreground-950 outline-none placeholder:text-foreground-400"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={sending || !draft.trim()}
          aria-label={t('community.comment')}
          className="ui-primary-button h-9 w-9 shrink-0 cursor-pointer"
        >
          {sending ? <Spinner /> : <i className="ri-reply-line"></i>}
        </button>
      </div>
    </div>
  );
}
