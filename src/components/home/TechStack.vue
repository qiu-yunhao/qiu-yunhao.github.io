<template>
  <section class="section">
    <div class="stack-layout">
      <div class="stack-copy">
        <p class="section-kicker">{{ t('home.techStack.eyebrow') }}</p>
        <h2>{{ t('home.techStack.title') }}</h2>
        <p class="section-desc">{{ t('home.techStack.description') }}</p>
      </div>

      <div class="stack-board">
        <span class="stack-item" v-for="item in stackList" :key="item">{{ item }}</span>
      </div>
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
  padding: 32px;
  background: var(--bg-surface);
  background-image: var(--section-shell-glaze);
  border: 1px solid var(--border-default);
  border-radius: 30px;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.08);
}

.stack-layout {
  display: grid;
  grid-template-columns: minmax(260px, 0.8fr) minmax(0, 1.2fr);
  gap: 24px;
  align-items: start;
}

.stack-copy {
  position: sticky;
  top: 104px;
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
  font-size: clamp(32px, 3vw, 44px);
}

.section-desc {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.8;
}

.stack-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.stack-item {
  min-height: 92px;
  display: grid;
  align-content: end;
  padding: 14px 16px;
  border-radius: 18px;
  background: var(--bg-soft);
  background-image: var(--chip-glaze);
  border: 1px solid var(--border-default);
  font-weight: 700;
  line-height: 1.4;
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

@media (max-width: 900px) {
  .stack-layout {
    grid-template-columns: 1fr;
  }

  .stack-copy {
    position: static;
  }
}
</style>
