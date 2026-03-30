<template>
  <section class="section">
    <div class="section-header">
      <div>
        <p class="section-link">{{ t('home.latestPosts.eyebrow') }}</p>
        <h2>{{ t('home.latestPosts.title') }}</h2>
      </div>
      <RouterLink class="section-link" to="/posts">{{ t('home.latestPosts.action') }}</RouterLink>
    </div>

    <div class="post-grid">
      <RouterLink
        class="post-card"
        v-for="post in postList"
        :key="post.slug"
        :to="{ name: 'post-detail', params: { slug: post.slug } }"
      >
        <p class="post-date">{{ post.date }} · {{ post.category }}</p>
        <h3>{{ getPostTitle(post) }}</h3>
        <p class="post-desc">{{ getPostDescription(post) }}</p>
        <div class="tag-list">
          <span class="tag" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { posts as postList } from '@/data/posts'

const { t } = useLocale()

const getPostTitle = (post) => post.title ?? t(post.titleKey)
const getPostDescription = (post) => post.description ?? t(post.descriptionKey)
</script>

<style scoped>
.section {
  padding: 28px;
  background: var(--bg-surface);
  background-image: var(--section-shell-glaze);
  border: 1px solid var(--border-default);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}

.section-header {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
}

.section-link {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--accent);
  font-weight: 600;
  background: var(--hero-pill-bg);
  border: 1px solid var(--chip-border);
}

.post-grid {
  display: grid;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.post-card {
  position: relative;
  display: block;
  padding: 20px;
  border: 1px solid var(--border-default);
  border-radius: 20px;
  background: var(--bg-soft);
  background-image: var(--section-inner-glaze);
  overflow: hidden;
}

.post-card::after {
  content: '';
  position: absolute;
  top: -2rem;
  right: -2rem;
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  background: radial-gradient(circle, var(--hero-button-glow) 0%, transparent 72%);
  opacity: 0.55;
  pointer-events: none;
}

.post-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-strong);
  box-shadow: var(--interactive-shadow);
}

.post-card h3 {
  margin: 0 0 16px;
  color: var(--text-primary);
}

.post-date {
  margin: 0 0 10px;
  color: var(--text-muted);
  font-size: 14px;
}

.post-desc {
  margin: 0 0 16px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.tag-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--chip-glaze);
  color: var(--accent);
  border: 1px solid var(--chip-border);
  font-size: 13px;
}

@media (max-width: 768px) {
  .post-grid {
    grid-template-columns: 1fr;
  }
}
</style>
