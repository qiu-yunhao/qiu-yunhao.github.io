<template>
  <section class="page">
    <h1>{{ t('postsPage.title') }}</h1>
    <p class="lead">{{ t('postsPage.lead') }}</p>

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

const getPostTitle = (post) => post.title ?? t(post.titleKey)
const getPostDescription = (post) => post.description ?? t(post.descriptionKey)
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
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
  display: block;
}

.post-link-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-strong);
  box-shadow: var(--interactive-shadow);
}

.meta {
  margin: 0 0 8px;
  color: var(--text-muted);
  font-size: 14px;
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
