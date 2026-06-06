import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/401', '/403'],
    },
    sitemap: 'https://trip4hanoi.online/sitemap.xml',
  }
}
