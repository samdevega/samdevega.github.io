import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const postCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
  })
})

export const collections = {
  posts: postCollection,
}
