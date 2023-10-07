import { getCollection } from 'astro:content'

export const posts = await getCollection('posts') || []
posts.sort((a, b) => +(b.data.pubDate.toISOString().split('T')[0].replaceAll('-', '')) - +(a.data.pubDate.toISOString().split('T')[0].replaceAll('-', '')))

export const translatePosts = async (lang) => {
  const postCollection = await getCollection('posts') || []
  const sortedPosts = postCollection.sort((a, b) => +(b.data.pubDate.toISOString().split('T')[0].replaceAll('-', '')) - +(a.data.pubDate.toISOString().split('T')[0].replaceAll('-', '')))
  return sortedPosts.filter(post => post.slug.includes(`${lang}/`)).map((post, index, posts) => {
    post.data.next = posts[index - 1]?.slug
    post.data.previous = posts[index + 1]?.slug.slice(3)
    post.slug = post.slug.slice(3)
    return post
  })
}
