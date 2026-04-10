<template>
  <div class="app-shell">
    <ClickHeartEffect />
    <div class="theme-pointer-layer" aria-hidden="true"></div>
    <div class="theme-focus-layer" aria-hidden="true"></div>
    <div class="theme-ripple-layer" aria-hidden="true">
      <span class="theme-ripple ripple-a"></span>
      <span class="theme-ripple ripple-b"></span>
      <span class="theme-ripple ripple-c"></span>
    </div>
    <div class="theme-local-layer" aria-hidden="true">
      <span
        v-for="item in localDecorations"
        :key="item.id"
        :class="item.className"
        :style="localStyle(item)"
      ></span>
    </div>

    <header class="site-header">
      <div class="container nav">
        <RouterLink class="logo" to="/">
          <span class="logo-mark">QYH</span>
          <span class="logo-copy">
            <strong>QYH Blog</strong>
            <small>{{ t('nav.status') }}</small>
          </span>
        </RouterLink>

        <nav class="nav-links">
          <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
          <RouterLink to="/posts">{{ t('nav.posts') }}</RouterLink>
          <RouterLink to="/projects">{{ t('nav.projects') }}</RouterLink>
          <RouterLink to="/about">{{ t('nav.about') }}</RouterLink>
        </nav>

        <div class="nav-controls">
          <LanguageSwitch />
          <ThemeSwitch />
        </div>
      </div>
    </header>

    <main class="site-main">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <footer class="site-footer">
      <div class="container footer-layout">
        <div>
          <p class="footer-title">QYH Blog</p>
          <p class="footer-text">{{ t('footer.tagline') }}</p>
        </div>
        <p class="footer-text">&copy; 2026 QYH. {{ t('footer.builtWith') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import ClickHeartEffect from '@/components/common/ClickHeartEffect.vue'
import LanguageSwitch from '@/components/common/LanguageSwitch.vue'
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()

const randomBetween = (min, max) => min + Math.random() * (max - min)

const createDecoration = (base) => ({
  ...base,
  x: base.x + randomBetween(-18, 18),
  y: base.y + randomBetween(-14, 14),
  rotate: (base.rotate ?? 0) + randomBetween(-6, 6),
  depthScale: (base.depthScale ?? 1) * randomBetween(0.92, 1.08),
  depthOpacity: Math.max(0.28, Math.min(1, (base.depthOpacity ?? 1) * randomBetween(0.88, 1.08))),
  driftX: base.driftX ?? randomBetween(-18, 18),
  driftY: base.driftY ?? randomBetween(-14, 14),
  driftRotate: base.driftRotate ?? randomBetween(-6, 6),
  driftDuration: base.driftDuration ?? randomBetween(14, 28),
  driftDelay: base.driftDelay ?? randomBetween(-8, 0),
})

const localDecorations = [
  createDecoration({ id: 'wave-a', className: 'wave-arc wave-arc-a', x: -116, y: -132, rotate: -18, rx: -24, ry: -14, depthScale: 1.22, depthOpacity: 1, driftX: -16, driftY: 12, driftDuration: 18 }),
  createDecoration({ id: 'wave-b', className: 'wave-arc wave-arc-b', x: 22, y: -58, rotate: 8, rx: 16, ry: -8, depthScale: 0.98, depthOpacity: 0.82, driftX: 14, driftY: -10, driftDuration: 22 }),
  createDecoration({ id: 'wave-c', className: 'wave-arc wave-arc-c', x: 174, y: 18, rotate: 22, rx: 10, ry: 8, depthScale: 0.8, depthOpacity: 0.62, driftX: 10, driftY: 8, driftDuration: 25 }),
  createDecoration({ id: 'foam-a', className: 'foam-line foam-a', x: 118, y: -74, rotate: -10, rx: 14, ry: -4, depthScale: 1.08, depthOpacity: 1, driftX: 12, driftY: 6, driftDuration: 16 }),
  createDecoration({ id: 'foam-b', className: 'foam-line foam-b', x: -58, y: 42, rotate: 14, rx: -10, ry: 6, depthScale: 0.88, depthOpacity: 0.74, driftX: -10, driftY: 8, driftDuration: 21 }),
  createDecoration({ id: 'water-a', className: 'water-dot water-a', x: 184, y: -118, depthScale: 1.24, depthOpacity: 1, driftX: 8, driftY: -12, driftDuration: 17 }),
  createDecoration({ id: 'water-b', className: 'water-dot water-b', x: 236, y: -18, depthScale: 0.92, depthOpacity: 0.72, driftX: -6, driftY: 10, driftDuration: 23 }),
  createDecoration({ id: 'water-c', className: 'water-dot water-c', x: 98, y: 82, depthScale: 0.72, depthOpacity: 0.56, driftX: 6, driftY: 6, driftDuration: 20 }),
  createDecoration({ id: 'leaf-a', className: 'leaf-spark leaf-a', x: 26, y: -136, rotate: 18, rrx: 18, depthScale: 1.14, depthOpacity: 1, driftX: 14, driftY: -10, driftRotate: 8, driftDuration: 19 }),
  createDecoration({ id: 'leaf-b', className: 'leaf-spark leaf-b', x: 120, y: -54, rotate: -12, rry: 14, depthScale: 0.98, depthOpacity: 0.8, driftX: -10, driftY: 10, driftRotate: -6, driftDuration: 22 }),
  createDecoration({ id: 'leaf-c', className: 'leaf-spark leaf-c', x: -32, y: 26, rotate: 34, rrx: 12, depthScale: 0.84, depthOpacity: 0.68, driftX: 8, driftY: 8, driftRotate: 5, driftDuration: 24 }),
  createDecoration({ id: 'leaf-d', className: 'leaf-spark leaf-d', x: 168, y: 32, rotate: -28, rry: 16, depthScale: 0.72, depthOpacity: 0.54, driftX: -8, driftY: 6, driftRotate: -5, driftDuration: 26 }),
  createDecoration({ id: 'petal-a', className: 'petal-dot petal-a', x: 78, y: -84, rotate: 24, depthScale: 1.04, depthOpacity: 1, driftX: 6, driftY: -8, driftDuration: 18 }),
  createDecoration({ id: 'petal-b', className: 'petal-dot petal-b', x: 146, y: -6, rotate: -18, depthScale: 0.84, depthOpacity: 0.7, driftX: -5, driftY: 6, driftDuration: 21 }),
  createDecoration({ id: 'petal-c', className: 'petal-dot petal-c', x: 12, y: 62, rotate: 12, depthScale: 0.68, depthOpacity: 0.54, driftX: 4, driftY: 4, driftDuration: 20 }),
  createDecoration({ id: 'branch-a', className: 'branch-line branch-a', x: -52, y: -146, rotate: -24, depthScale: 1.06, depthOpacity: 0.92, driftX: 10, driftY: -6, driftDuration: 26 }),
  createDecoration({ id: 'branch-b', className: 'branch-line branch-b', x: 166, y: 96, rotate: 18, depthScale: 0.8, depthOpacity: 0.6, driftX: -10, driftY: 8, driftDuration: 28 }),
  createDecoration({ id: 'heat-a', className: 'heat-stream heat-a', x: -24, y: -92, rotate: 4, rrx: 8, depthScale: 1.12, depthOpacity: 1, driftX: 22, driftY: -6, driftDuration: 16 }),
  createDecoration({ id: 'heat-b', className: 'heat-stream heat-b', x: 48, y: -18, rotate: -6, rry: 6, depthScale: 0.96, depthOpacity: 0.76, driftX: 16, driftY: 4, driftDuration: 20 }),
  createDecoration({ id: 'heat-c', className: 'heat-stream heat-c', x: 150, y: 48, rotate: 10, rrx: 10, depthScale: 0.8, depthOpacity: 0.6, driftX: 12, driftY: 6, driftDuration: 24 }),
  createDecoration({ id: 'cloud-a', className: 'cloud-edge cloud-a', x: -70, y: -112, rotate: -4, depthScale: 1.02, depthOpacity: 0.9, driftX: 18, driftY: -4, driftDuration: 20 }),
  createDecoration({ id: 'cloud-b', className: 'cloud-edge cloud-b', x: 164, y: 28, rotate: 8, depthScale: 0.82, depthOpacity: 0.64, driftX: 14, driftY: 6, driftDuration: 24 }),
  createDecoration({ id: 'mountain-a', className: 'mountain-line mountain-a', x: -72, y: 132, rotate: -6, depthScale: 0.92, depthOpacity: 0.76, driftX: 8, driftY: 0, driftDuration: 30 }),
  createDecoration({ id: 'mountain-b', className: 'mountain-line mountain-b', x: 170, y: 164, rotate: 4, depthScale: 0.72, depthOpacity: 0.56, driftX: 6, driftY: 0, driftDuration: 34 }),
]

const localStyle = (item) => ({
  '--base-x': `${item.x}px`,
  '--base-y': `${item.y}px`,
  '--base-rotate': `${item.rotate ?? 0}deg`,
  '--react-x': `${item.rx ?? 0}px`,
  '--react-y': `${item.ry ?? 0}px`,
  '--rotate-react-x': `${item.rrx ?? 0}deg`,
  '--rotate-react-y': `${item.rry ?? 0}deg`,
  '--depth-scale': String(item.depthScale ?? 1),
  '--depth-opacity': String(item.depthOpacity ?? 1),
  '--drift-x': `${item.driftX ?? 0}px`,
  '--drift-y': `${item.driftY ?? 0}px`,
  '--drift-rotate': `${item.driftRotate ?? 0}deg`,
  '--drift-duration': `${item.driftDuration ?? 20}s`,
  '--drift-delay': `${item.driftDelay ?? 0}s`,
})

let frameId = 0
let pointerX = 0.5
let pointerY = 0.5
let currentX = 0.5
let currentY = 0.5

const applyPointerVars = () => {
  currentX += (pointerX - currentX) * 0.08
  currentY += (pointerY - currentY) * 0.08

  const offsetX = (currentX - 0.5) * 2
  const offsetY = (currentY - 0.5) * 2
  const root = document.documentElement

  root.style.setProperty('--pointer-x', currentX.toFixed(4))
  root.style.setProperty('--pointer-y', currentY.toFixed(4))
  root.style.setProperty('--pointer-offset-x', offsetX.toFixed(4))
  root.style.setProperty('--pointer-offset-y', offsetY.toFixed(4))

  frameId = window.requestAnimationFrame(applyPointerVars)
}

const updatePointer = (event) => {
  pointerX = event.clientX / window.innerWidth
  pointerY = event.clientY / window.innerHeight
}

const resetPointer = () => {
  pointerX = 0.5
  pointerY = 0.5
}

onMounted(() => {
  const root = document.documentElement
  root.style.setProperty('--pointer-x', '0.5')
  root.style.setProperty('--pointer-y', '0.5')
  root.style.setProperty('--pointer-offset-x', '0')
  root.style.setProperty('--pointer-offset-y', '0')

  window.addEventListener('pointermove', updatePointer, { passive: true })
  window.addEventListener('pointerleave', resetPointer)
  frameId = window.requestAnimationFrame(applyPointerVars)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', updatePointer)
  window.removeEventListener('pointerleave', resetPointer)
  window.cancelAnimationFrame(frameId)
})
</script>
