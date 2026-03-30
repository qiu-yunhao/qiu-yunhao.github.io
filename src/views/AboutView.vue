<template>
  <section class="page about-page">
    <div class="about-intro">
      <div class="about-copy card">
        <h1>{{ t('about.title') }}</h1>
        <p class="lead">{{ t('about.lead') }}</p>

        <div class="about-meta">
          <article class="card info-card">
            <h2>{{ t('about.currentFocusTitle') }}</h2>
            <p>{{ t('about.currentFocusText') }}</p>
          </article>

          <article class="card info-card contact-card">
            <div class="contact-header">
              <h2>{{ t('about.contactTitle') }}</h2>
              <p>{{ t('about.contactLead') }}</p>
            </div>

            <div class="contact-list">
              <div class="contact-item" v-for="item in contactItems" :key="item.type">
                <span class="contact-label">{{ t(item.labelKey) }}</span>
                <strong class="contact-value">{{ item.value }}</strong>
              </div>
            </div>
          </article>
        </div>
      </div>

      <RouterLink v-if="heroCategory" class="about-hero card hero-link" :to="{ name: 'about-gallery-detail', params: { slug: heroCategory.slug } }">
        <img
          v-if="heroCategory.cover && !failedImages.has(heroCategory.cover)"
          :src="heroCategory.cover"
          :alt="heroCategory.alt"
          @error="markImageFailed(heroCategory.cover)"
        />
        <div v-else class="image-fallback hero-fallback">
          <span class="fallback-kicker">ABOUT IMAGE</span>
          <strong>{{ t(heroCategory.titleKey) }}</strong>
          <p>{{ t(heroCategory.detailKey) }}</p>
        </div>
        <div class="hero-caption">
          <strong>{{ t(heroCategory.titleKey) }}</strong>
          <span>{{ t(heroCategory.captionKey) }}</span>
          <div class="hero-meta">
            <span class="count-badge">{{ formatCount(heroCategory.imageCount) }}</span>
            <em>{{ t('about.openDetail') }}</em>
          </div>
        </div>
      </RouterLink>
    </div>

    <section class="gallery-section">
      <div class="gallery-heading">
        <h2>{{ t('about.galleryTitle') }}</h2>
        <p>{{ t('about.galleryLead') }}</p>
      </div>

      <section class="about-gallery" :class="galleryGridClass">
        <RouterLink
          class="gallery-card card"
          v-for="item in galleryCategories"
          :key="item.slug"
          :to="{ name: 'about-gallery-detail', params: { slug: item.slug } }"
        >
          <div class="gallery-media">
            <img
              v-if="item.cover && !failedImages.has(item.cover)"
              :src="item.cover"
              :alt="item.alt"
              @error="markImageFailed(item.cover)"
            />
            <div v-else class="image-fallback">
              <span class="fallback-kicker">PHOTO</span>
              <strong>{{ t(item.titleKey) }}</strong>
            </div>
          </div>
          <div class="gallery-copy">
            <div class="gallery-copy-top">
              <h3>{{ t(item.titleKey) }}</h3>
              <span class="count-badge">{{ formatCount(item.imageCount) }}</span>
            </div>
            <p>{{ t(item.captionKey) }}</p>
            <span class="detail-link">{{ t('about.openDetail') }}</span>
          </div>
        </RouterLink>
      </section>
    </section>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { aboutGallery } from '@/data/aboutGallery'

const { locale, t } = useLocale()
const failedImages = reactive(new Set())

const heroCategory = aboutGallery.find((item) => item.featured) ?? null
const galleryCategories = computed(() => aboutGallery.filter((item) => !item.featured))

const galleryGridClass = computed(() => {
  const count = galleryCategories.value.length

  if (count <= 1) return 'gallery-grid-single'
  if (count === 2) return 'gallery-grid-double'
  return 'gallery-grid-triple'
})

const contactItems = [
  { type: 'qq', labelKey: 'contact.qq', value: '1193603447' },
  { type: 'phone', labelKey: 'contact.phone', value: '177-9278-9656' },
  { type: 'email', labelKey: 'contact.email', value: '1193603447@qq.com' },
  { type: 'wechat', labelKey: 'contact.wechat', value: 'q18371077046' },
]

const formatCount = (count) => (locale.value === 'zh-CN' ? `${count} 张图片` : `${count} photos`)

const markImageFailed = (src) => {
  failedImages.add(src)
}
</script>

<style scoped>
.about-page {
  display: grid;
  gap: 24px;
}

.about-intro {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 24px;
  align-items: stretch;
}

.about-copy {
  display: grid;
  gap: 24px;
}

.about-copy h1 {
  margin-bottom: 0;
}

.about-meta {
  display: grid;
  gap: 16px;
}

.info-card {
  box-shadow: none;
  background: var(--bg-soft);
  background-image: var(--section-inner-glaze);
}

.contact-card {
  gap: 18px;
}

.contact-header {
  display: grid;
  gap: 8px;
}

.contact-header h2,
.contact-header p {
  margin: 0;
}

.contact-header p {
  color: var(--text-secondary);
  line-height: 1.7;
}

.contact-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.contact-item {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--bg-surface);
  background-image: var(--chip-glaze);
  border: 1px solid var(--chip-border);
}

.contact-label {
  font-size: 13px;
  color: var(--text-muted);
}

.contact-value {
  font-size: 16px;
  color: var(--text-primary);
}

.about-hero {
  margin: 0;
  display: grid;
  gap: 14px;
  overflow: hidden;
}

.hero-link,
.gallery-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.hero-link:hover,
.gallery-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-strong);
  box-shadow: var(--interactive-shadow);
}

.about-hero img,
.gallery-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-hero img {
  min-height: 420px;
  border-radius: 18px;
}

.hero-caption {
  display: grid;
  gap: 8px;
}

.hero-caption strong {
  color: var(--text-primary);
}

.hero-caption span {
  color: var(--text-secondary);
  line-height: 1.7;
}

.hero-meta,
.gallery-copy-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--chip-glaze);
  color: var(--accent);
  border: 1px solid var(--chip-border);
  font-size: 13px;
  font-weight: 600;
}

.hero-caption em,
.detail-link {
  color: var(--accent);
  font-style: normal;
  font-weight: 600;
}

.gallery-section {
  display: grid;
  gap: 16px;
}

.gallery-heading {
  display: grid;
  gap: 8px;
}

.gallery-heading h2,
.gallery-heading p {
  margin: 0;
}

.gallery-heading p {
  color: var(--text-secondary);
  line-height: 1.7;
}

.about-gallery {
  display: grid;
  gap: 16px;
}

.gallery-grid-single {
  grid-template-columns: 1fr;
}

.gallery-grid-double {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gallery-grid-triple {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.gallery-card {
  display: grid;
  gap: 14px;
  padding: 16px;
  overflow: hidden;
}

.gallery-media {
  min-height: 220px;
  border-radius: 18px;
  overflow: hidden;
  background:
    linear-gradient(135deg, var(--accent-soft), rgba(255, 255, 255, 0.6)),
    var(--bg-soft);
}

.gallery-copy {
  display: grid;
  gap: 10px;
}

.gallery-copy h3 {
  margin: 0;
  font-size: 18px;
}

.gallery-copy p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

.image-fallback {
  min-height: 100%;
  display: grid;
  align-content: end;
  gap: 8px;
  padding: 20px;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.7), transparent 35%),
    linear-gradient(135deg, var(--accent-soft), var(--bg-soft));
  color: var(--text-primary);
}

.hero-fallback {
  min-height: 420px;
  border-radius: 18px;
}

.fallback-kicker {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--accent);
}

@media (max-width: 960px) {
  .about-intro {
    grid-template-columns: 1fr;
  }

  .about-hero img,
  .hero-fallback {
    min-height: 320px;
  }

  .gallery-grid-double,
  .gallery-grid-triple {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .contact-list,
  .gallery-grid-double,
  .gallery-grid-triple {
    grid-template-columns: 1fr;
  }

  .gallery-media {
    min-height: 200px;
  }
}
</style>
