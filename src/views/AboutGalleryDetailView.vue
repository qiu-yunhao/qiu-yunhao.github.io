<template>
  <section v-if="category" class="page detail-page">
    <RouterLink class="back-link" to="/about">{{ t('about.detailBack') }}</RouterLink>

    <article class="detail-shell card">
      <div class="detail-media">
        <img
          v-if="category.cover && !failedImages.has(category.cover)"
          :src="category.cover"
          :alt="category.alt"
          @error="markImageFailed(category.cover)"
        />
        <div v-else class="detail-fallback">
          <span class="fallback-kicker">DETAIL VIEW</span>
          <strong>{{ t(category.titleKey) }}</strong>
          <p>{{ t(category.detailKey) }}</p>
        </div>
      </div>

      <div class="detail-copy">
        <p class="detail-kicker">{{ t('about.galleryTitle') }}</p>
        <h1>{{ t(category.titleKey) }}</h1>
        <p class="lead">{{ t(category.captionKey) }}</p>
        <p class="detail-count">{{ formatCount(category.imageCount) }}</p>
        <p class="detail-text">{{ t(category.detailKey) }}</p>
      </div>
    </article>

    <section class="detail-images">
      <div class="detail-more-header">
        <h2>{{ t('about.detailMore') }}</h2>
      </div>

      <div class="detail-grid" :class="detailGridClass">
        <article class="detail-image-card card" v-for="image in displayedImages" :key="image.id">
          <div class="detail-card-media">
            <img v-if="!failedImages.has(image.src)" :src="image.src" :alt="image.alt" @error="markImageFailed(image.src)" />
            <div v-else class="detail-mini-fallback">
              <span class="fallback-kicker">PHOTO</span>
              <strong>{{ t(category.titleKey) }}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="detail-more">
      <div class="detail-more-header">
        <h2>{{ t('about.galleryTitle') }}</h2>
      </div>

      <div class="category-grid">
        <RouterLink
          v-for="item in relatedCategories"
          :key="item.slug"
          class="detail-card card"
          :to="{ name: 'about-gallery-detail', params: { slug: item.slug } }"
        >
          <div class="detail-card-media">
            <img v-if="item.cover && !failedImages.has(item.cover)" :src="item.cover" :alt="item.alt" @error="markImageFailed(item.cover)" />
            <div v-else class="detail-mini-fallback">
              <span class="fallback-kicker">PHOTO</span>
              <strong>{{ t(item.titleKey) }}</strong>
            </div>
          </div>
          <div class="detail-card-copy">
            <div class="detail-card-top">
              <h3>{{ t(item.titleKey) }}</h3>
              <span class="count-badge">{{ formatCount(item.imageCount) }}</span>
            </div>
            <p>{{ t(item.captionKey) }}</p>
          </div>
        </RouterLink>
      </div>
    </section>
  </section>

  <section v-else class="page">
    <h1>404</h1>
    <p class="lead">{{ t('notFound.lead') }}</p>
    <RouterLink class="back-link" to="/about">{{ t('about.detailBack') }}</RouterLink>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { aboutGallery } from '@/data/aboutGallery'

const route = useRoute()
const { locale, t } = useLocale()
const failedImages = reactive(new Set())

const category = computed(() => aboutGallery.find((item) => item.slug === route.params.slug))
const displayedImages = computed(() => category.value?.images ?? [])
const relatedCategories = computed(() => aboutGallery.filter((item) => item.slug !== route.params.slug && !item.featured))

const detailGridClass = computed(() => {
  const count = displayedImages.value.length

  if (count <= 1) return 'detail-grid-single'
  if (count === 2) return 'detail-grid-double'
  if (count <= 4) return 'detail-grid-balanced'
  return 'detail-grid-dense'
})

const formatCount = (count) => (locale.value === 'zh-CN' ? `${count} 张图片` : `${count} photos`)

const markImageFailed = (src) => {
  failedImages.add(src)
}
</script>

<style scoped>
.detail-page {
  display: grid;
  gap: 24px;
}

.detail-shell {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  overflow: hidden;
}

.detail-media {
  min-height: 480px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--accent-soft), var(--bg-soft));
}

.detail-media img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.detail-fallback,
.detail-mini-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  align-content: end;
  gap: 8px;
  padding: 24px;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.7), transparent 35%),
    linear-gradient(135deg, var(--accent-soft), var(--bg-soft));
}

.detail-copy {
  display: grid;
  align-content: center;
  gap: 14px;
}

.detail-copy h1 {
  margin: 0;
}

.detail-kicker,
.fallback-kicker {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--accent);
}

.detail-count {
  margin: 0;
  color: var(--accent);
  font-weight: 600;
}

.detail-text {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.9;
}

.detail-images,
.detail-more {
  display: grid;
  gap: 16px;
}

.detail-more-header h2 {
  margin: 0;
}

.detail-grid,
.category-grid {
  display: grid;
  gap: 16px;
}

.detail-grid-single {
  grid-template-columns: 1fr;
}

.detail-grid-double {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.detail-grid-balanced {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.detail-grid-dense {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.detail-image-card,
.detail-card {
  padding: 16px;
}

.detail-card-media {
  min-height: 180px;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--accent-soft), var(--bg-soft));
}

.detail-grid-single .detail-card-media {
  min-height: 480px;
}

.detail-grid-double .detail-card-media {
  min-height: 320px;
}

.detail-card-media img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.category-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.detail-card {
  display: grid;
  gap: 12px;
}

.detail-card-copy {
  display: grid;
  gap: 8px;
}

.detail-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.detail-card-copy h3,
.detail-card-copy p {
  margin: 0;
}

.detail-card-copy p {
  color: var(--text-secondary);
  line-height: 1.7;
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

@media (max-width: 960px) {
  .detail-shell,
  .detail-grid-dense,
  .category-grid {
    grid-template-columns: 1fr;
  }

  .detail-media {
    min-height: 320px;
  }

  .detail-grid-double,
  .detail-grid-balanced {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .detail-grid-double,
  .detail-grid-balanced {
    grid-template-columns: 1fr;
  }

  .detail-grid-single .detail-card-media,
  .detail-grid-double .detail-card-media,
  .detail-card-media {
    min-height: 220px;
  }
}
</style>
