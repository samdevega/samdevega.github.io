import { getCollection } from 'astro:content'

function postPubDateToInt(post) {
  return +(post.data.pubDate.toISOString().split('T')[0].replaceAll('-', ''))
}

export const posts = await getCollection('posts') || []
posts.sort((a, b) => postPubDateToInt(b) - postPubDateToInt(a))

export const translatePosts = async (lang) => {
  const postCollection = await getCollection('posts') || []
  const sortedPosts = postCollection.sort((a, b) => postPubDateToInt(b) - postPubDateToInt(a))
  return sortedPosts.filter(post => post.slug.includes(`${lang}/`)).map((post, index, posts) => {
    post.data.next = posts[index - 1]?.slug.slice(3)
    post.data.previous = posts[index + 1]?.slug.slice(3)
    return post
  })
}
