<template>
  <section class="hero">
    <div class="hero-copy">
      <div class="hero-scenery" aria-hidden="true">
        <span class="hero-scene-disc"></span>
        <span class="hero-scene-band"></span>
        <span class="hero-scene-mark"></span>
        <span class="hero-scene-trail"></span>
        <span class="hero-scene-particles"></span>
      </div>

      <p class="eyebrow">{{ t('home.hero.eyebrow') }}</p>
      <h1>{{ t('home.hero.title') }}</h1>
      <p class="hero-text">{{ t('home.hero.description') }}</p>

      <div class="hero-actions">
        <RouterLink class="primary-btn" to="/posts">{{ t('home.hero.primaryAction') }}</RouterLink>
        <RouterLink class="secondary-btn" to="/projects">{{ t('home.hero.secondaryAction') }}</RouterLink>
      </div>

      <dl class="hero-metrics">
        <div class="hero-metric" v-for="item in heroMetrics" :key="item.label">
          <dt>{{ item.value }}</dt>
          <dd>{{ item.label }}</dd>
        </div>
      </dl>
    </div>

    <div class="hero-card hero-focus-card">
      <p class="hero-card-label">{{ t('home.focusCard.label') }}</p>
      <h2>{{ t('home.focusCard.title') }}</h2>
      <FocusBookmark
        :title="t('home.focusCard.title')"
        :subtitle="t('home.focusCard.subtitle')"
        :hint="t('home.focusCard.hint')"
        :tags="t('home.focusCard.tags')"
        :items="focusItems"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { posts } from '@/data/posts'
import { projects } from '@/data/projects'
import { techStack } from '@/data/techStack'

const FocusBookmark = defineAsyncComponent(() => import('@/components/home/FocusBookmark.vue'))
const { t } = useLocale()
const focusItems = computed(() => t('home.focusCard.items'))
const heroMetrics = computed(() => [
  { value: posts.length, label: t('home.metrics.posts') },
  { value: projects.length, label: t('home.metrics.projects') },
  { value: techStack.length, label: t('home.metrics.stack') },
])
</script>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 26px;
  align-items: stretch;
  position: relative;
}

.hero-copy,
.hero-card {
  position: relative;
  overflow: hidden;
  padding: 36px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 30px;
  box-shadow: 0 30px 72px rgba(15, 23, 42, 0.09);
}

.hero-copy {
  background-image: var(--hero-copy-glaze);
}

.hero-card {
  background-image: var(--hero-card-glaze);
}

.hero-focus-card {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 12px;
  align-content: stretch;
  min-height: 100%;
  padding: 18px;
}

.hero-copy::before,
.hero-card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: var(--hero-frame-pattern);
  opacity: 0.8;
}

.hero-copy::after {
  content: '';
  position: absolute;
  inset: auto 1.4rem 1.1rem auto;
  width: 7rem;
  height: 7rem;
  border-radius: 1.4rem;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.14), transparent 58%),
    radial-gradient(circle, var(--hero-button-glow) 0%, transparent 70%);
  opacity: 0.58;
  filter: blur(2px);
  pointer-events: none;
}

.hero-card::after {
  content: '';
  position: absolute;
  inset: auto 0 0 auto;
  width: 8.5rem;
  height: 8rem;
  clip-path: var(--hero-card-deco-clip);
  background: var(--hero-card-deco-bg);
  opacity: 0.7;
  pointer-events: none;
}

.hero-scenery {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-scene-disc,
.hero-scene-band,
.hero-scene-mark,
.hero-scene-trail,
.hero-scene-particles {
  position: absolute;
  display: block;
}

.hero-scene-disc {
  width: var(--hero-scene-disc-width);
  height: var(--hero-scene-disc-height);
  top: var(--hero-scene-disc-top, auto);
  right: var(--hero-scene-disc-right, auto);
  bottom: var(--hero-scene-disc-bottom, auto);
  left: var(--hero-scene-disc-left, auto);
  border-radius: var(--hero-scene-disc-radius);
  clip-path: var(--hero-scene-disc-clip);
  background: var(--hero-scene-disc-bg);
  transform: var(--hero-scene-disc-transform);
  opacity: var(--hero-scene-disc-opacity);
}

.hero-scene-band {
  width: var(--hero-scene-band-width);
  height: var(--hero-scene-band-height);
  top: var(--hero-scene-band-top, auto);
  right: var(--hero-scene-band-right, auto);
  bottom: var(--hero-scene-band-bottom, auto);
  left: var(--hero-scene-band-left, auto);
  border-radius: var(--hero-scene-band-radius);
  clip-path: var(--hero-scene-band-clip);
  background: var(--hero-scene-band-bg);
  transform: var(--hero-scene-band-transform);
  opacity: var(--hero-scene-band-opacity);
}

.hero-scene-mark {
  width: var(--hero-scene-mark-width);
  height: var(--hero-scene-mark-height);
  top: var(--hero-scene-mark-top, auto);
  right: var(--hero-scene-mark-right, auto);
  bottom: var(--hero-scene-mark-bottom, auto);
  left: var(--hero-scene-mark-left, auto);
  border-radius: var(--hero-scene-mark-radius);
  clip-path: var(--hero-scene-mark-clip);
  background: var(--hero-scene-mark-bg);
  transform: var(--hero-scene-mark-transform);
  opacity: var(--hero-scene-mark-opacity);
}

.hero-scene-trail {
  right: 2rem;
  bottom: 1.6rem;
  width: 14rem;
  height: 4rem;
  background:
    linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent-soft) 86%, white) 18%, transparent 82%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.16) 0 1px, transparent 1px 18px);
  clip-path: polygon(0 76%, 20% 60%, 38% 70%, 56% 46%, 74% 62%, 100% 52%, 100% 76%, 0 100%);
  opacity: 0.5;
  transform: rotate(-4deg);
}

.hero-scene-particles {
  top: 2rem;
  right: 5rem;
  width: 8rem;
  height: 8rem;
  background:
    radial-gradient(circle at 14% 18%, rgba(255, 255, 255, 0.72) 0 1.1px, transparent 1.7px),
    radial-gradient(circle at 72% 24%, color-mix(in srgb, var(--accent) 44%, white) 0 1.2px, transparent 1.8px),
    radial-gradient(circle at 42% 76%, rgba(255, 255, 255, 0.5) 0 1px, transparent 1.7px),
    radial-gradient(circle at 84% 70%, color-mix(in srgb, var(--accent-soft) 90%, white) 0 1.4px, transparent 2px);
  opacity: 0.7;
  animation: hero-particles 16s linear infinite alternate;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin: 0 0 12px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--accent);
  font-weight: 700;
  background: var(--hero-pill-bg);
  border: 1px solid rgba(255, 255, 255, 0.36);
  position: relative;
  z-index: 1;
}

h1 {
  margin: 0 0 16px;
  font-family: var(--font-display);
  font-size: clamp(52px, 6vw, 78px);
  line-height: 0.98;
  letter-spacing: -0.04em;
  max-width: 8ch;
  position: relative;
  z-index: 1;
  background-image: var(--hero-title-fill);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-text {
  margin: 0;
  font-size: clamp(18px, 1.6vw, 21px);
  line-height: 1.9;
  color: var(--text-secondary);
  max-width: 46ch;
  position: relative;
  z-index: 1;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
  position: relative;
  z-index: 1;
}

.hero-metrics {
  margin: 34px 0 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  position: relative;
  z-index: 1;
}

.hero-metric {
  margin: 0;
  padding: 16px 18px;
  border-radius: 20px;
  background: color-mix(in srgb, var(--bg-surface) 82%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-default) 86%, transparent);
  backdrop-filter: blur(8px);
}

.hero-metric dt,
.hero-metric dd {
  margin: 0;
}

.hero-metric dt {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
}

.hero-metric dd {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.primary-btn,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 12px 20px;
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.primary-btn {
  background: var(--accent);
  color: var(--accent-contrast);
  box-shadow: 0 14px 30px var(--hero-button-glow);
}

.secondary-btn {
  border: 1px solid var(--border-default);
  background: var(--bg-soft);
  color: var(--text-primary);
}

.primary-btn:hover,
.secondary-btn:hover {
  transform: translateY(-2px);
}

.secondary-btn:hover {
  border-color: var(--border-strong);
}

.hero-card-label {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin: 0 0 8px;
  padding: 7px 11px;
  border-radius: 999px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 700;
  background: var(--hero-pill-bg);
  border: 1px solid rgba(255, 255, 255, 0.36);
  position: relative;
  z-index: 1;
}

.hero-card h2 {
  margin: 0 0 12px;
  position: relative;
  z-index: 1;
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1.08;
}

.hero-focus-card .hero-card-label,
.hero-focus-card h2 {
  margin-left: 8px;
  margin-right: 8px;
}

@keyframes hero-particles {
  from {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }

  to {
    transform: translate3d(-10px, 8px, 0) rotate(6deg);
  }
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 34px;
    max-width: none;
  }

  .hero-actions {
    flex-wrap: wrap;
  }

  .hero-metrics {
    grid-template-columns: 1fr;
  }

  .hero-copy::after {
    width: 5rem;
    height: 5rem;
    right: 1rem;
    bottom: 1rem;
  }

  .hero-scene-disc {
    transform: scale(0.84) var(--hero-scene-disc-transform);
    transform-origin: center;
  }
}
</style>
