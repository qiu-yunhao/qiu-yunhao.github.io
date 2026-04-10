<template>
  <div class="switch-group" :aria-label="t('nav.language')">
    <button
      v-for="item in localeOptions"
      :key="item.value"
      class="switch-button"
      :class="{ active: locale === item.value }"
      type="button"
      @click="setLocale(item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'

const { locale, setLocale, t } = useLocale()

const localeOptions = computed(() => [
  { value: 'zh-CN', label: t('language.zhCN') },
  { value: 'en-US', label: t('language.enUS') },
])
</script>

<style scoped>
.switch-group {
  display: inline-flex;
  padding: 5px;
  border: 1px solid var(--header-pill-border);
  border-radius: 999px;
  background: var(--header-pill-glaze);
  box-shadow: var(--header-pill-shadow);
  backdrop-filter: blur(10px);
}

.switch-button {
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  min-width: 52px;
  padding: 9px 13px;
  border-radius: 999px;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.switch-button:hover {
  color: var(--text-primary);
}

.switch-button.active {
  background: var(--header-pill-active-glaze);
  color: var(--header-pill-active-text);
  box-shadow: var(--shadow-sm);
}
</style>
