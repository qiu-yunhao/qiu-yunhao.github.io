<template>
  <section class="page">
    <section class="page-hero">
      <div class="page-hero-main">
        <p class="page-kicker">POST ARCHIVE</p>
        <h1>{{ t('postsPage.title') }}</h1>
        <p class="lead">{{ t('postsPage.lead') }}</p>
      </div>

      <aside class="page-hero-side">
        <h2>{{ t('postsPage.summaryTitle') }}</h2>
        <p>{{ t('postsPage.summaryLead') }}</p>
        <ul class="page-hero-list">
          <li>{{ summaryLines.total }}</li>
          <li>{{ summaryLines.categories }}</li>
          <li>{{ summaryLines.latest }}</li>
        </ul>
      </aside>
    </section>

    <div class="filter-bar">
      <span class="filter-chip active">{{ t('postsPage.filters.all') }}</span>
      <span class="filter-chip" v-for="category in categories" :key="category">{{ category }}</span>
    </div>

    <div class="card-list">
      <RouterLink
        v-for="post in postList"
        :key="post.slug"
        class="card post-link-card"
        :to="{ name: 'post-detail', params: { slug: post.slug } }"
      >
        <p class="meta">{{ post.date }} · {{ post.category }}</p>
        <h2>{{ getPostTitle(post) }}</h2>
        <p class="description">{{ getPostDescription(post) }}</p>
        <div class="tag-list">
          <span class="tag" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { posts as postList } from '@/data/posts'

const { t } = useLocale()

const categories = computed(() => [...new Set(postList.map((post) => post.category))])
const datedPosts = computed(() => postList.filter((post) => post.date))
const latestPost = computed(() => datedPosts.value[0] ?? null)
const summaryLines = computed(() => ({
  total: t('postsPage.summary.total', { count: postList.length }),
  categories: t('postsPage.summary.categories', { count: categories.value.length }),
  latest: latestPost.value
    ? t('postsPage.summary.latest', { title: getPostTitle(latestPost.value) })
    : t('postsPage.summary.latestFallback'),
}))

const getPostTitle = (post) => post.title ?? t(post.titleKey)
const getPostDescription = (post) => post.description ?? t(post.descriptionKey)
</script>

<style scoped>
.page-hero-main {
  position: relative;
  overflow: hidden;
}

.page-hero-main::before {
  content: '';
  position: absolute;
  inset: auto 1.4rem 1.2rem auto;
  width: 12rem;
  height: 4.6rem;
  background:
    linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent-soft) 88%, white) 22%, transparent 84%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.18) 0 1px, transparent 1px 16px);
  clip-path: polygon(0 72%, 18% 56%, 34% 64%, 50% 42%, 68% 56%, 84% 48%, 100% 54%, 100% 74%, 0 100%);
  opacity: 0.56;
  transform: rotate(-3deg);
  pointer-events: none;
}

.filter-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  padding: 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--bg-surface) 72%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-default) 84%, transparent);
  width: fit-content;
  max-width: 100%;
}

.filter-chip {
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--chip-glaze);
  color: var(--text-secondary);
  border: 1px solid var(--chip-border);
  font-size: 14px;
}

.filter-chip.active {
  background: var(--accent);
  color: var(--accent-contrast);
  border-color: var(--accent);
}

.post-link-card {
  position: relative;
  display: block;
  overflow: hidden;
}

.post-link-card::after {
  content: '';
  position: absolute;
  inset: auto -1rem -1rem auto;
  width: 8rem;
  height: 8rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.22), color-mix(in srgb, var(--accent) 16%, transparent));
  clip-path: polygon(0 100%, 18% 66%, 34% 78%, 52% 42%, 70% 58%, 88% 18%, 100% 0, 100% 100%);
  opacity: 0.46;
  pointer-events: none;
}

.post-link-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-strong);
  box-shadow: var(--interactive-shadow);
}

.meta {
  margin: 0 0 8px;
  color: var(--text-muted);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.description {
  color: var(--text-secondary);
  line-height: 1.75;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.tag {
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--chip-glaze);
  color: var(--accent);
  border: 1px solid var(--chip-border);
  font-size: 13px;
}
</style>
