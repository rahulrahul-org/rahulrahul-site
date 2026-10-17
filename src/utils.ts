import { getCollection } from 'astro:content';

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export const readingTime = (text = '') => Math.max(1, Math.round(text.split(/\s+/).length / 220));

/** Published posts, newest first. */
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
