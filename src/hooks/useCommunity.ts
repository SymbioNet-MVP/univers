import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { CommunityComment, CommunityPost, PostType, Profile } from '@/types/db';

export interface PostWithAuthor extends CommunityPost {
  author: Profile | null;
}

async function fetchAuthors(ids: string[]): Promise<Map<string, Profile>> {
  const map = new Map<string, Profile>();
  if (ids.length === 0) return map;
  const { data } = await supabase.from('profiles').select('*').in('id', ids);
  (data as Profile[] | null)?.forEach((p) => map.set(p.id, p));
  return map;
}

export function useCommunity() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: postError } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (postError) throw postError;
      const rawPosts = (data as CommunityPost[]) ?? [];
      const authors = await fetchAuthors(Array.from(new Set(rawPosts.map((p) => p.author_id))));
      setPosts(
        rawPosts.map((post) => ({ ...post, author: authors.get(post.author_id) ?? null })),
      );
    } catch (err) {
      console.error('Failed to load posts', err);
      setError('error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createPost = useCallback(
    async (payload: { type: PostType; title: string; body: string; field: string }) => {
      if (!user) return;
      const { error: insertError } = await supabase.from('community_posts').insert({
        author_id: user.id,
        type: payload.type,
        title: payload.title.trim(),
        body: payload.body.trim(),
        field: payload.field.trim() || null,
      });
      if (insertError) throw insertError;
      await load();
    },
    [user, load],
  );

  return { posts, loading, error, reload: load, createPost };
}

export function useComments(postId: string | undefined) {
  const { user } = useAuth();
  const [comments, setComments] = useState<(CommunityComment & { author: Profile | null })[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      const raw = (data as CommunityComment[]) ?? [];
      const authors = await fetchAuthors(Array.from(new Set(raw.map((c) => c.author_id))));
      setComments(raw.map((c) => ({ ...c, author: authors.get(c.author_id) ?? null })));
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    void load();
  }, [load]);

  const addComment = useCallback(
    async (body: string) => {
      if (!postId || !user) return;
      const trimmed = body.trim();
      if (!trimmed) return;
      const { error } = await supabase
        .from('community_comments')
        .insert({ post_id: postId, author_id: user.id, body: trimmed });
      if (error) throw error;
      await load();
    },
    [postId, user, load],
  );

  return { comments, loading, reload: load, addComment };
}