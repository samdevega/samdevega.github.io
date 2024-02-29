import rss from '@astrojs/rss'
import { translatePosts } from '../../scripts/posts'
import { site, siteTitle } from '../../constants'
import { useTranslations } from '../../i18n/utils'

export async function GET() {
  const lang = 'en'
  const t = useTranslations(lang)
  const posts = await translatePosts(lang)
  return rss({
    title: `${siteTitle} - ${t('nav.blog')}`,
    description: 'My posts',
    site: `https://${site}`,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      link: `${lang}/blog/${post.slug.slice(3)}`
    })),
    customData: `<language>${lang}</language>`,
  })
}