<template>
  <div class="click-heart-layer" aria-hidden="true">
    <canvas ref="canvasRef" class="click-heart-canvas"></canvas>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvasRef = ref(null)

/**
 * Centralized parameters for easy art direction.
 * Each click creates one particle-heart effect instance at the click position.
 * Tune these values to adjust particle count, shatter force, damping,
 * alpha fade, size shrink, and total effect duration.
 */
const CONFIG = {
  particleCount: 720,
  reducedMotionCount: 220,
  maxEffects: 12,
  outlineRatio: 0.38,
  heartScale: 4.7,
  heartVerticalOffset: -1.4,
  particleSize: { min: 0.7, max: 1.9 },
  glowMultiplier: 2.4,
  totalDuration: 5000,
  formDuration: 520,
  breatheDuration: 980,
  shatterDuration: 3500,
  clickInfluenceRadius: 46,
  clickForce: 6.2,
  damping: 0.948,
  alphaDecay: 0.012,
  shrinkDecay: 0.009,
  flowAmplitude: 0.7,
  flowSpeed: 0.0014,
  breatheAmplitude: 0.05,
  breatheSpeed: 0.0032,
  spreadDelay: 460,
  outwardBias: 0.74,
  reducedMotionForce: 4.8,
  outlineFormBoost: 0.82,
  interiorFormBoost: 0.62,
}

let ctx = null
let animationFrame = 0
let lastTime = 0
let dpr = 1
let viewportWidth = 0
let viewportHeight = 0
let prefersReducedMotion = false
let reducedMotionQuery = null
let effectId = 0
let particleId = 0
const effects = []

const basePalettes = {
  default: {
    core: [234, 247, 255],
    accent: [86, 177, 232],
    glow: [188, 230, 252],
    spark: [255, 255, 255],
    splash: true,
    splashLift: 1.55,
    splashSpread: 1.26,
    outlineGlowBoost: 1.12,
  },
  forest: {
    core: [244, 249, 240],
    accent: [121, 180, 109],
    glow: [208, 233, 198],
    spark: [255, 255, 255],
    splash: false,
    splashLift: 1,
    splashSpread: 1,
    outlineGlowBoost: 1,
  },
  sunset: {
    core: [255, 240, 232],
    accent: [241, 133, 92],
    glow: [255, 205, 176],
    spark: [255, 252, 247],
    splash: false,
    splashLift: 1.08,
    splashSpread: 1.08,
    outlineGlowBoost: 1.04,
  },
}

const randomBetween = (min, max) => min + Math.random() * (max - min)
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const hexToRgb = (value, fallback) => {
  if (!value) {
    return fallback
  }

  const normalized = value.trim()
  const match = normalized.match(/^#([0-9a-f]{6})$/i)
  if (!match) {
    return fallback
  }

  const hex = match[1]
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ]
}

const mixRgb = (from, to, ratio) => from.map((value, index) => Math.round(value + (to[index] - value) * ratio))

const getThemeProfile = () => {
  const root = document.documentElement
  const themeName = root.dataset.theme || 'default'
  const base = basePalettes[themeName] || basePalettes.default
  const styles = getComputedStyle(root)
  const accent = hexToRgb(styles.getPropertyValue('--accent'), base.accent)
  const accentSoft = hexToRgb(styles.getPropertyValue('--accent-soft'), base.glow)
  const spark = base.spark

  return {
    name: themeName,
    core: mixRgb(accentSoft, spark, 0.58),
    accent,
    glow: mixRgb(accentSoft, spark, 0.28),
    spark,
    splash: base.splash,
    splashLift: base.splashLift,
    splashSpread: base.splashSpread,
    outlineGlowBoost: base.outlineGlowBoost,
  }
}

/**
 * Heart sampling formula:
 * x = 16 sin^3(t)
 * y = 13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t)
 *
 * We sample the parametric curve and then blend some points toward the center,
 * so the heart is made from many glowing particles rather than a flat shape.
 */
const sampleHeartPoint = (preferOutline = false) => {
  const t = randomBetween(0, Math.PI * 2)
  const rawX = 16 * Math.sin(t) ** 3
  const rawY =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t)

  const interiorBlend = preferOutline
    ? randomBetween(0.82, 1)
    : randomBetween(0.22, 0.94) * (Math.random() ** 0.82)

  return {
    offsetX: rawX * interiorBlend * CONFIG.heartScale,
    offsetY: -rawY * interiorBlend * CONFIG.heartScale + CONFIG.heartVerticalOffset,
    edgeWeight: interiorBlend,
  }
}

/**
 * Particle initialization:
 * Each particle stores its home offset inside the heart, current position,
 * velocity, alpha, scale, and a delayed shatter schedule.
 */
const createParticle = (centerX, centerY, index, total) => {
  const outline = Math.random() < CONFIG.outlineRatio
  const point = sampleHeartPoint(outline)
  const sizeMix = Math.random()
  const baseSize = prefersReducedMotion
    ? randomBetween(1.4, 2.4)
    : CONFIG.particleSize.min + (CONFIG.particleSize.max - CONFIG.particleSize.min) * sizeMix

  return {
    id: particleId += 1,
    homeOffsetX: point.offsetX,
    homeOffsetY: point.offsetY,
    x: centerX + point.offsetX * (outline ? 0.72 : 0.26),
    y: centerY + point.offsetY * (outline ? 0.72 : 0.26),
    vx: 0,
    vy: 0,
    baseSize: outline ? baseSize * 1.12 : baseSize,
    size: (outline ? baseSize * 1.12 : baseSize) * 0.48,
    alpha: 0,
    targetAlpha: outline ? 0.86 + point.edgeWeight * 0.08 : 0.48 + point.edgeWeight * 0.22,
    edgeWeight: point.edgeWeight,
    outline,
    flowSeed: randomBetween(0, Math.PI * 2),
    flicker: randomBetween(0.88, 1.15),
    depth: 0.5 + (index / total) * 0.5,
    shattered: false,
    launchReady: false,
    shatterDelay: 0,
    fadeFloor: outline ? randomBetween(0.04, 0.1) : randomBetween(0.03, 0.1),
  }
}

const createEffect = (x, y) => {
  const particleCount = prefersReducedMotion ? CONFIG.reducedMotionCount : CONFIG.particleCount
  const createdAt = performance.now()
  const themeProfile = getThemeProfile()
  const effect = {
    id: effectId += 1,
    x,
    y,
    theme: themeProfile,
    createdAt,
    shatterAt: createdAt + CONFIG.formDuration + CONFIG.breatheDuration,
    expiresAt: createdAt + CONFIG.totalDuration,
    particles: Array.from({ length: particleCount }, (_, index) => createParticle(x, y, index, particleCount)),
  }

  /**
   * Click shatter logic:
   * The effect is created exactly at the click position. Particles nearer the
   * clicked center get lower delays and stronger forces, so the breakup starts
   * near the impact and spreads outward with layered timing.
   */
  effect.particles.forEach((particle) => {
    const distance = Math.hypot(particle.homeOffsetX, particle.homeOffsetY)
    const influence = clamp(1 - distance / CONFIG.clickInfluenceRadius, 0, 1)
    particle.shatterDelay = (1 - influence) * CONFIG.spreadDelay + randomBetween(0, 140)
  })

  effects.push(effect)
  if (effects.length > CONFIG.maxEffects) {
    effects.splice(0, effects.length - CONFIG.maxEffects)
  }
}

const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  viewportWidth = window.innerWidth
  viewportHeight = window.innerHeight
  dpr = window.devicePixelRatio || 1

  canvas.width = Math.floor(viewportWidth * dpr)
  canvas.height = Math.floor(viewportHeight * dpr)
  canvas.style.width = `${viewportWidth}px`
  canvas.style.height = `${viewportHeight}px`

  if (!ctx) {
    ctx = canvas.getContext('2d')
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

const updateReducedMotion = () => {
  prefersReducedMotion = reducedMotionQuery?.matches ?? false
}

const spawnEffectFromClick = (event) => {
  if (event.button !== 0) {
    return
  }

  createEffect(event.clientX, event.clientY)
}

const launchParticle = (particle, forceMultiplier) => {
  const norm = Math.hypot(particle.homeOffsetX, particle.homeOffsetY) || 1
  const outwardX = particle.homeOffsetX / norm
  const outwardY = particle.homeOffsetY / norm
  const randomAngle = Math.atan2(outwardY, outwardX) + randomBetween(-0.75, 0.75)
  const baseForce = prefersReducedMotion ? CONFIG.reducedMotionForce : CONFIG.clickForce
  const theme = particle.theme
  const spreadFactor = theme.splash ? theme.splashSpread : 1
  const force = baseForce * forceMultiplier * (0.72 + particle.edgeWeight * 0.5) * spreadFactor

  particle.vx += Math.cos(randomAngle) * force * (1 - CONFIG.outwardBias) + outwardX * force * CONFIG.outwardBias
  particle.vy += Math.sin(randomAngle) * force * (1 - CONFIG.outwardBias) + outwardY * force * CONFIG.outwardBias - randomBetween(0.3, 1.6) * theme.splashLift
  particle.targetAlpha = randomBetween(0.05, 0.22)
  particle.shattered = true
  particle.launchReady = true
}

const updateParticle = (particle, effect, time, deltaFactor) => {
  const age = time - effect.createdAt
  const breathePhase = Math.sin(age * CONFIG.breatheSpeed + particle.flowSeed)
  const breatheScale = 1 + breathePhase * CONFIG.breatheAmplitude
  const flowX = Math.sin(age * CONFIG.flowSpeed + particle.flowSeed * 1.7) * CONFIG.flowAmplitude * particle.depth
  const flowY = Math.cos(age * CONFIG.flowSpeed * 0.86 + particle.flowSeed) * CONFIG.flowAmplitude * particle.depth

  const homeX = effect.x + particle.homeOffsetX * breatheScale + flowX
  const homeY = effect.y + particle.homeOffsetY * breatheScale + flowY
  const timeLeft = effect.expiresAt - time
  const fadeOutWindow = 620

  if (age < CONFIG.formDuration) {
    const formProgress = age / CONFIG.formDuration
    const positionRate = particle.outline
      ? CONFIG.outlineFormBoost * (0.18 + formProgress * 0.14)
      : CONFIG.interiorFormBoost * (0.22 + formProgress * 0.16)
    particle.x += (homeX - particle.x) * positionRate * deltaFactor
    particle.y += (homeY - particle.y) * positionRate * deltaFactor
    const alphaRate = particle.outline ? 0.24 : 0.18
    const sizeRate = particle.outline ? 0.22 : 0.17
    particle.alpha += (particle.targetAlpha - particle.alpha) * alphaRate * deltaFactor
    particle.size += (particle.baseSize - particle.size) * sizeRate * deltaFactor
    return
  }

  if (time >= effect.shatterAt + particle.shatterDelay && !particle.launchReady) {
    const distance = Math.hypot(particle.homeOffsetX, particle.homeOffsetY)
    const influence = clamp(1 - distance / CONFIG.clickInfluenceRadius, 0.24, 1)
    launchParticle(particle, influence)
  }

  if (!particle.shattered) {
    particle.x += (homeX - particle.x) * 0.08 * deltaFactor
    particle.y += (homeY - particle.y) * 0.08 * deltaFactor
    particle.alpha += (particle.targetAlpha - particle.alpha) * (particle.outline ? 0.08 : 0.07) * deltaFactor
    particle.size += (particle.baseSize * breatheScale - particle.size) * (particle.outline ? 0.1 : 0.09) * deltaFactor
  } else {
    particle.x += particle.vx * deltaFactor
    particle.y += particle.vy * deltaFactor
    particle.vx *= CONFIG.damping
    particle.vy *= CONFIG.damping
    particle.alpha = Math.max(particle.fadeFloor, particle.alpha - CONFIG.alphaDecay * deltaFactor)
    particle.size = Math.max(0.12, particle.size - CONFIG.shrinkDecay * deltaFactor)
  }

  if (timeLeft <= fadeOutWindow) {
    const fadeProgress = clamp(timeLeft / fadeOutWindow, 0, 1)
    particle.alpha = Math.min(particle.alpha, particle.targetAlpha * fadeProgress)
    particle.size = Math.min(particle.size, Math.max(0.01, particle.baseSize * fadeProgress))
  }
}

const drawParticle = (particle) => {
  const theme = particle.theme
  const alpha = clamp(particle.alpha * particle.flicker, 0, 1)
  if (alpha <= 0.01 || particle.size <= 0.08) {
    return
  }

  const glowSize = particle.size * CONFIG.glowMultiplier
  if (!particle.shattered && particle.outline) {
    ctx.strokeStyle = `rgba(${theme.spark.join(',')}, ${alpha * 0.22 * theme.outlineGlowBoost})`
    ctx.lineWidth = Math.max(0.6, particle.size * 0.22)
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, glowSize * 0.42, 0, Math.PI * 2)
    ctx.stroke()
  }
  const gradient = ctx.createRadialGradient(
    particle.x,
    particle.y,
    0,
    particle.x,
    particle.y,
    glowSize,
  )

  gradient.addColorStop(0, `rgba(${theme.spark.join(',')}, ${alpha * (particle.outline ? 1 : 0.94)})`)
  gradient.addColorStop(0.2, `rgba(${theme.glow.join(',')}, ${alpha * (particle.outline ? 0.62 : 0.44)})`)
  gradient.addColorStop(1, `rgba(${theme.accent.join(',')}, 0)`)

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2)
  ctx.fill()

  const coreColor = particle.outline ? theme.spark : theme.core
  ctx.fillStyle = `rgba(${coreColor.join(',')}, ${alpha})`
  ctx.beginPath()
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
  ctx.fill()

  if (theme.splash && particle.shattered) {
    ctx.strokeStyle = `rgba(${theme.glow.join(',')}, ${alpha * 0.12})`
    ctx.lineWidth = Math.max(0.4, particle.size * 0.16)
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, glowSize * 0.62, -0.25 * Math.PI, 0.2 * Math.PI)
    ctx.stroke()
  }
}

/**
 * Particle update and render loop:
 * 1) clear canvas
 * 2) update all active click-created heart effects
 * 3) render each particle as a soft glow + bright core
 * 4) discard finished effects once their 5 second lifecycle ends
 */
const renderFrame = (time) => {
  if (!ctx) {
    return
  }

  const delta = lastTime ? Math.min((time - lastTime) / 16.6667, 2) : 1
  lastTime = time

  ctx.clearRect(0, 0, viewportWidth, viewportHeight)

  for (let index = effects.length - 1; index >= 0; index -= 1) {
    const effect = effects[index]

    if (time >= effect.expiresAt) {
      effects.splice(index, 1)
      continue
    }

    effect.particles.forEach((particle) => {
      particle.theme = effect.theme
      updateParticle(particle, effect, time, delta)
      drawParticle(particle)
    })
  }

  animationFrame = window.requestAnimationFrame(renderFrame)
}

/**
 * Lifecycle cleanup:
 * Each click-generated heart is removed after 5 seconds, so every animation is
 * local to the click position and completes as one continuous effect.
 */
onMounted(() => {
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateReducedMotion()
  resizeCanvas()

  if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', updateReducedMotion)
  } else {
    reducedMotionQuery.addListener(updateReducedMotion)
  }

  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('pointerdown', spawnEffectFromClick, { passive: true })
  animationFrame = window.requestAnimationFrame(renderFrame)
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('pointerdown', spawnEffectFromClick)

  if (reducedMotionQuery) {
    if (typeof reducedMotionQuery.removeEventListener === 'function') {
      reducedMotionQuery.removeEventListener('change', updateReducedMotion)
    } else {
      reducedMotionQuery.removeListener(updateReducedMotion)
    }
  }
})
</script>

<style scoped>
.click-heart-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 40;
  overflow: hidden;
}

.click-heart-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .click-heart-layer {
    opacity: 0.94;
  }
}
</style>
