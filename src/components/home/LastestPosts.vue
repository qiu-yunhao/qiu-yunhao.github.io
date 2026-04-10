<template>
  <section class="section">
    <div class="section-header">
      <div>
        <p class="section-link">{{ t('home.latestPosts.eyebrow') }}</p>
        <h2>{{ t('home.latestPosts.title') }}</h2>
      </div>
      <RouterLink class="section-link" to="/posts">{{ t('home.latestPosts.action') }}</RouterLink>
    </div>

    <div class="post-showcase">
      <RouterLink
        v-if="featuredPost"
        class="post-card post-card-featured"
        :to="{ name: 'post-detail', params: { slug: featuredPost.slug } }"
      >
        <p class="post-date">{{ featuredPost.date }} · {{ featuredPost.category }}</p>
        <h3>{{ getPostTitle(featuredPost) }}</h3>
        <p class="post-desc">{{ getPostDescription(featuredPost) }}</p>
        <div class="tag-list">
          <span class="tag" v-for="tag in featuredPost.tags" :key="tag">{{ tag }}</span>
        </div>
      </RouterLink>

      <div class="post-stack">
        <RouterLink
          class="post-card post-card-compact"
          v-for="post in secondaryPosts"
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
    </div>

    <div class="post-grid">
      <RouterLink
        class="post-card post-card-grid"
        v-for="post in gridPosts"
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
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { posts as postList } from '@/data/posts'

const { t } = useLocale()
const featuredPost = computed(() => postList[0] ?? null)
const secondaryPosts = computed(() => postList.slice(1, 4))
const gridPosts = computed(() => postList.slice(4, 8))

const getPostTitle = (post) => post.title ?? t(post.titleKey)
const getPostDescription = (post) => post.description ?? t(post.descriptionKey)
</script>

<style scoped>
.section {
  padding: 32px;
  background: var(--bg-surface);
  background-image: var(--section-shell-glaze);
  border: 1px solid var(--border-default);
  border-radius: 30px;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.section-header h2 {
  margin: 0;
  font-size: clamp(32px, 3vw, 44px);
}

.section-link {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--accent);
  font-weight: 700;
  background: var(--hero-pill-bg);
  border: 1px solid var(--chip-border);
}

.post-showcase {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 16px;
  margin-bottom: 16px;
}

.post-stack,
.post-grid {
  display: grid;
  gap: 16px;
}

.post-grid {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.post-card {
  position: relative;
  display: grid;
  gap: 10px;
  padding: 22px;
  border: 1px solid var(--border-default);
  border-radius: 24px;
  background: var(--bg-soft);
  background-image: var(--section-inner-glaze);
  overflow: hidden;
  transition:
    transform 0.24s ease,
    border-color 0.24s ease,
    box-shadow 0.24s ease;
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

.post-card-featured {
  align-content: end;
  min-height: 100%;
  padding: 28px;
}

.post-card-featured h3 {
  margin: 0;
  font-size: clamp(30px, 3vw, 42px);
  line-height: 1.05;
  max-width: 12ch;
}

.post-card-compact h3,
.post-card-grid h3 {
  margin: 0;
  font-size: 22px;
  line-height: 1.18;
}

.post-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-strong);
  box-shadow: var(--interactive-shadow);
}

.post-date {
  margin: 0;
  color: var(--text-muted);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.post-desc {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.8;
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

@media (max-width: 900px) {
  .post-showcase {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .post-grid {
    grid-template-columns: 1fr;
  }
}
</style>
