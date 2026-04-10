<template>
  <label class="theme-select-wrap">
    <span class="theme-label">{{ t('nav.theme') }}</span>
    <select class="theme-select" :value="theme" @change="setTheme($event.target.value)">
      <option v-for="item in themeOptions" :key="item.value" :value="item.value">
        {{ item.label }}
      </option>
    </select>
  </label>
</template>

<script setup>
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { useTheme } from '@/composables/useTheme'

const { t } = useLocale()
const { theme, setTheme, themes } = useTheme()

const themeOptions = computed(() =>
  themes.map((item) => ({
    value: item,
    label: t(`themes.${item}`),
  })),
)
</script>

<style scoped>
.theme-select-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 6px 5px 13px;
  border: 1px solid var(--header-pill-border);
  border-radius: 999px;
  background: var(--header-pill-glaze);
  color: var(--text-secondary);
  box-shadow: var(--header-pill-shadow);
  backdrop-filter: blur(10px);
}

.theme-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.theme-select {
  border: 0;
  border-radius: 999px;
  padding: 9px 13px;
  background: rgba(255, 255, 255, 0.48);
  color: var(--text-primary);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  outline: none;
}
</style>
