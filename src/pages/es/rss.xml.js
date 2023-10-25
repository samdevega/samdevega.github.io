import rss from '@astrojs/rss'
import { translatePosts } from '../../scripts/posts'
import { site, siteTitle } from '../../constants'
import { useTranslations } from '../../i18n/utils'

export async function get() {
  const lang = 'es'
  const t = useTranslations(lang)
  const posts = await translatePosts(lang)
  return rss({
    title: `${siteTitle} - ${t('nav.blog')}`,
    description: 'Mis publicaciones',
    site: `https://${site}`,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      link: `${lang}/blog/${post.slug.slice(3)}`
    })),
    customData: `<language>${lang}</language>`,
  })
}