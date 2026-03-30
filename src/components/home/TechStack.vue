<template>
  <section class="section">
    <p class="section-kicker">{{ t('home.techStack.eyebrow') }}</p>
    <h2>{{ t('home.techStack.title') }}</h2>
    <p class="section-desc">{{ t('home.techStack.description') }}</p>

    <div class="stack-board">
      <span class="stack-item" v-for="item in stackList" :key="item">{{ item }}</span>
    </div>
  </section>
</template>

<script setup>
import { useLocale } from '@/composables/useLocale'
import { techStack as stackList } from '@/data/techStack'

const { t } = useLocale()
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

.section-kicker {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin: 0 0 8px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--accent);
  font-weight: 700;
  background: var(--hero-pill-bg);
  border: 1px solid var(--chip-border);
}

h2 {
  margin: 0 0 10px;
}

.section-desc {
  margin: 0 0 18px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.stack-board {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.stack-item {
  padding: 10px 14px;
  border-radius: 12px;
  background: var(--bg-soft);
  background-image: var(--chip-glaze);
  border: 1px solid var(--border-default);
  font-weight: 600;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.stack-item:hover {
  transform: translateY(-2px);
  border-color: var(--border-strong);
  box-shadow: var(--interactive-shadow);
}
</style>
