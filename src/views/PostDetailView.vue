<template>
  <section v-if="post" class="post-page">
    <RouterLink class="back-link" to="/posts">← 返回文章列表</RouterLink>

    <header class="post-hero">
      <p class="post-meta">{{ post.date }} · {{ post.category }}</p>
      <h1>{{ postTitle }}</h1>
      <p class="post-summary">{{ postDescription }}</p>
      <div class="post-tags">
        <span class="post-tag" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
      </div>
    </header>

    <div class="post-layout">
      <aside class="toc-card" v-if="headings.length">
        <p class="toc-title">目录</p>
        <a
          v-for="heading in headings"
          :key="heading.id"
          class="toc-link"
          :class="`level-${heading.level}`"
          :href="`#${heading.id}`"
        >
          {{ heading.text }}
        </a>
      </aside>

      <article class="post-content card">
        <MarkdownRenderer :content="post.content" />
      </article>
    </div>
  </section>

  <section v-else class="page">
    <h1>文章不存在</h1>
    <p class="lead">这个文章链接暂时没有找到，你可以先回到文章列表继续浏览。</p>
    <RouterLink class="back-link" to="/posts">返回文章列表</RouterLink>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import MarkdownRenderer from '@/components/post/MarkdownRenderer.vue'
import { useLocale } from '@/composables/useLocale'
import { getPostBySlug } from '@/data/posts'
import { parseMarkdown } from '@/utils/markdown'

const route = useRoute()
const { t } = useLocale()

const post = computed(() => getPostBySlug(route.params.slug))
const postTitle = computed(() => {
  if (!post.value) {
    return ''
  }

  return post.value.title ?? (post.value.titleKey ? t(post.value.titleKey) : '')
})

const postDescription = computed(() => {
  if (!post.value) {
    return ''
  }

  return post.value.description ?? (post.value.descriptionKey ? t(post.value.descriptionKey) : '')
})
const headings = computed(() => (post.value ? parseMarkdown(post.value.content).headings : []))
</script>

<style scoped>
.post-page {
  display: grid;
  gap: 24px;
  width: 100%;
  min-width: 0;
}

.post-hero {
  width: 100%;
  min-width: 0;
  padding: clamp(24px, 3vw, 40px);
  border-radius: 24px;
  background: var(--bg-surface);
  background-image: var(--theme-card-glaze);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
}

.post-meta {
  margin: 0 0 12px;
  color: var(--text-muted);
  font-size: 14px;
}

.post-hero h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.1;
}

.post-summary {
  margin: 16px 0 0;
  max-width: 70ch;
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1.05rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.post-tag {
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--chip-glaze);
  color: var(--accent);
  border: 1px solid var(--chip-border);
  font-size: 13px;
}

.post-layout {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: clamp(20px, 2.4vw, 36px);
  align-items: start;
  width: 100%;
  min-width: 0;
}

.toc-card {
  position: sticky;
  top: 96px;
  max-height: calc(100vh - 120px);
  overflow: auto;
  padding: clamp(18px, 2vw, 24px);
  border-radius: 20px;
  background: var(--bg-surface);
  background-image: var(--theme-card-glaze);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
}

.toc-title {
  margin: 0 0 14px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}

.toc-link {
  display: block;
  padding: 8px 0;
  color: var(--text-secondary);
  transition: color 0.2s ease;
  overflow-wrap: anywhere;
}

.toc-link:hover {
  color: var(--accent);
}

.toc-link.level-2,
.toc-link.level-3,
.toc-link.level-4,
.toc-link.level-5,
.toc-link.level-6 {
  padding-left: 14px;
}

.post-content {
  width: 100%;
  max-width: none;
  min-width: 0;
  padding: clamp(24px, 3vw, 40px);
  border-radius: 28px;
  overflow: hidden;
}

@media (min-width: 1680px) {
  .post-layout {
    grid-template-columns: minmax(260px, 340px) minmax(0, 1fr);
    gap: 40px;
  }
}

@media (max-width: 1180px) {
  .post-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .toc-card {
    position: static;
    top: auto;
    max-height: none;
    order: -1;
  }
}

@media (max-width: 920px) {
  .post-layout {
    grid-template-columns: 1fr;
  }

  .toc-card {
    order: 0;
  }

  .post-content {
    width: 100%;
  }
}

@media (max-width: 720px) {
  .post-page {
    gap: 18px;
  }

  .post-hero h1 {
    font-size: clamp(1.8rem, 9vw, 2.5rem);
  }

  .post-summary {
    font-size: 0.98rem;
    line-height: 1.7;
  }

  .post-hero,
  .post-content,
  .toc-card {
    padding: 20px;
  }
}

@media (max-width: 560px) {
  .post-hero,
  .post-content,
  .toc-card {
    padding: 16px;
    border-radius: 20px;
  }

  .post-tags {
    gap: 8px;
  }

  .post-tag {
    padding: 6px 10px;
    font-size: 12px;
  }

  .toc-link {
    padding: 6px 0;
    font-size: 0.95rem;
  }
}
</style>
