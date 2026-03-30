const imageModules = import.meta.glob('../assets/about/*/*.{png,jpg,jpeg,webp,avif,svg}', {
  eager: true,
  import: 'default',
})

const categoryMeta = {
  hero: {
    slug: 'hero',
    titleKey: 'aboutGallery.hero.title',
    captionKey: 'aboutGallery.hero.caption',
    detailKey: 'aboutGallery.hero.detail',
    alt: 'About hero image',
    featured: true,
  },
  study: {
    slug: 'study',
    titleKey: 'aboutGallery.study.title',
    captionKey: 'aboutGallery.study.caption',
    detailKey: 'aboutGallery.study.detail',
    alt: 'Study moment image',
  },
  hobby: {
    slug: 'hobby',
    titleKey: 'aboutGallery.hobby.title',
    captionKey: 'aboutGallery.hobby.caption',
    detailKey: 'aboutGallery.hobby.detail',
    alt: 'Hobby image',
  },
  work: {
    slug: 'work',
    titleKey: 'aboutGallery.work.title',
    captionKey: 'aboutGallery.work.caption',
    detailKey: 'aboutGallery.work.detail',
    alt: 'Work showcase image',
  },
}

const parseImagePath = (path) => {
  const match = path.match(/about\/([^/]+)\/([^/]+)\.[^.]+$/)
  if (!match) {
    return null
  }

  return {
    category: match[1],
    name: match[2],
  }
}

const groupedImages = Object.entries(imageModules).reduce((accumulator, [path, src]) => {
  const parsed = parseImagePath(path)
  if (!parsed) {
    return accumulator
  }

  if (!accumulator[parsed.category]) {
    accumulator[parsed.category] = []
  }

  accumulator[parsed.category].push({
    id: `${parsed.category}-${parsed.name}`,
    src,
    alt: categoryMeta[parsed.category]?.alt ?? 'About gallery image',
    order: parsed.name,
  })

  return accumulator
}, {})

const buildCategory = (meta) => {
  const images = (groupedImages[meta.slug] ?? []).sort((first, second) => first.order.localeCompare(second.order))

  return {
    ...meta,
    cover: images[0]?.src ?? '',
    images,
    imageCount: images.length,
  }
}

export const aboutGallery = Object.values(categoryMeta).map(buildCategory)
