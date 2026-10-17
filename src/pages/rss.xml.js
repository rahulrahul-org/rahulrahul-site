import rss from '@astrojs/rss';
import { SITE } from '../site';
import { getPosts } from '../utils';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: `${SITE.name} - Case Studies & Blogs`,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blogs/${post.id}/`,
    })),
  });
}
