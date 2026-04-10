<template>
  <div class="bookmark-shell">
    <div class="bookmark-stage" :class="`theme-${currentTheme}`">
      <div ref="canvasHost" class="bookmark-canvas"></div>

      <div class="bookmark-props" aria-hidden="true">
        <span class="bookmark-prop prop-a"></span>
        <span class="bookmark-prop prop-b"></span>
        <span class="bookmark-prop prop-c"></span>
      </div>

      <div class="bookmark-splashes" aria-hidden="true">
        <span
          v-for="splash in splashes"
          :key="splash.id"
          class="splash-drop"
          :style="{
            left: `${splash.x}px`,
            top: `${splash.y}px`,
            width: `${splash.size}px`,
            height: `${splash.size}px`,
            '--dx': `${splash.dx}px`,
            '--dy': `${splash.dy}px`,
            '--delay': `${splash.delay}ms`,
          }"
        ></span>
      </div>

      <div class="bookmark-overlay">
        <p>{{ subtitle }}</p>
        <span>{{ hint }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { useLocale } from '@/composables/useLocale'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
  tags: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
    required: true,
  },
})

const { locale } = useLocale()
const canvasHost = ref(null)
const currentTheme = ref(document.documentElement.dataset.theme || 'default')
const splashes = ref([])
const subtitle = computed(() => props.subtitle || props.tags.join(' / '))
const hint = computed(() => props.hint || 'Drag to bend and fold the bookmark.')

const themedTags = computed(() => {
  const isZh = locale.value === 'zh-CN'
  const tagMap = {
    default: isZh ? ['海盐档案', '冰感推演'] : ['Sea Salt Archive', 'Ice Drift'],
    forest: isZh ? ['林冠札记', '春枝微光'] : ['Canopy Notes', 'Spring Moss'],
    sunset: isZh ? ['落霞索引', '暖金余晖'] : ['Sunset Ledger', 'Warm Ember'],
  }

  return tagMap[currentTheme.value] ?? tagMap.default
})

let runtime = null
let splashId = 0
const splashTimers = new Set()

const getThemePalette = (theme) => {
  const palettes = {
    default: {
      paper: ['#e7f4ff', '#d2ebfb', '#c1dff2'],
      ink: '#103650',
      accent: '#2f7cae',
      muted: 'rgba(24, 83, 122, 0.78)',
      pillFill: 'rgba(224, 244, 255, 0.78)',
      pillStroke: 'rgba(129, 185, 221, 0.54)',
      panel: '#e6f5ff',
      spine: '#b7d6ea',
      rivet: '#dff6ff',
      shadow: '#163e5c',
    },
    forest: {
      paper: ['#ecf4e7', '#dcebd2', '#cadfbf'],
      ink: '#243523',
      accent: '#4f7d4c',
      muted: 'rgba(55, 91, 53, 0.8)',
      pillFill: 'rgba(234, 245, 227, 0.8)',
      pillStroke: 'rgba(143, 178, 132, 0.56)',
      panel: '#e7f0e1',
      spine: '#b8cfac',
      rivet: '#dff0d4',
      shadow: '#2e4a2f',
    },
    sunset: {
      paper: ['#fff0df', '#ffd9bb', '#f1bf92'],
      ink: '#4b2817',
      accent: '#bf6530',
      muted: 'rgba(137, 76, 43, 0.82)',
      pillFill: 'rgba(255, 234, 210, 0.82)',
      pillStroke: 'rgba(226, 155, 108, 0.56)',
      panel: '#ffe9d4',
      spine: '#e0b181',
      rivet: '#ffe2bf',
      shadow: '#6b3620',
    },
  }

  return palettes[theme] ?? palettes.default
}

const spawnSeaSplash = (x, y) => {
  if (currentTheme.value !== 'default') {
    return
  }

  const entries = Array.from({ length: 6 }, (_, index) => ({
    id: splashId + index,
    x: x + (Math.random() - 0.5) * 18,
    y: y + (Math.random() - 0.5) * 14,
    size: Math.random() * 8 + 5,
    dx: (Math.random() - 0.5) * 34,
    dy: -(Math.random() * 26 + 14),
    delay: Math.random() * 70,
  }))
  splashId += entries.length
  splashes.value = [...splashes.value, ...entries].slice(-42)

  const timer = window.setTimeout(() => {
    splashes.value = splashes.value.filter((item) => !entries.some((entry) => entry.id === item.id))
    splashTimers.delete(timer)
  }, 760)

  splashTimers.add(timer)
}

const createBookmarkTexture = (theme, title, tags, items) => {
  const canvas = document.createElement('canvas')
  canvas.width = 1792
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  const palette = getThemePalette(theme)

  const drawWrappedText = ({ text, x, y, maxWidth, lineHeight, maxLines, align = 'left', font, color }) => {
    ctx.save()
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = align

    const units = Array.from(text)
    const lines = []
    let line = ''

    for (const unit of units) {
      const next = line + unit
      if (ctx.measureText(next).width > maxWidth && line) {
        lines.push(line)
        line = unit
      } else {
        line = next
      }
    }

    if (line) {
      lines.push(line)
    }

    lines.slice(0, maxLines).forEach((content, index) => {
      ctx.fillText(content, x, y + index * lineHeight)
    })
    ctx.restore()
  }

  const drawPill = ({ text, x, y, fill, stroke, color }) => {
    ctx.save()
    ctx.font = '700 22px "Courier New", monospace'
    const width = ctx.measureText(text).width + 56
    const height = 54
    const top = y - height / 2
    const pillGradient = ctx.createLinearGradient(x, top, x, top + height)
    pillGradient.addColorStop(0, 'rgba(255, 246, 227, 0.78)')
    pillGradient.addColorStop(1, fill)
    ctx.fillStyle = pillGradient
    ctx.strokeStyle = stroke
    ctx.lineWidth = 2
    const radius = 999
    ctx.shadowColor = 'rgba(52, 36, 24, 0.12)'
    ctx.shadowBlur = 14
    ctx.shadowOffsetY = 4
    ctx.beginPath()
    ctx.roundRect(x, top, width, height, radius)
    ctx.fill()
    ctx.shadowColor = 'transparent'
    ctx.stroke()

    ctx.strokeStyle = 'rgba(255, 248, 233, 0.32)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(x + 3, top + 3, width - 6, height - 6, radius)
    ctx.stroke()

    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, x + width / 2, y + 1)
    ctx.restore()
    return width
  }

  const paperGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  paperGradient.addColorStop(0, palette.paper[0])
  paperGradient.addColorStop(0.55, palette.paper[1])
  paperGradient.addColorStop(1, palette.paper[2])
  ctx.fillStyle = paperGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const vignette = ctx.createRadialGradient(canvas.width * 0.42, canvas.height * 0.48, 120, canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.62)
  vignette.addColorStop(0, 'rgba(255, 247, 231, 0)')
  vignette.addColorStop(1, `${palette.shadow}26`)
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let y = 0; y < canvas.height; y += 3) {
    const alpha = 0.012 + (Math.sin(y * 0.011) + 1) * 0.006
      ctx.fillStyle = `${palette.shadow}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
      ctx.fillRect(0, y, canvas.width, 1)
  }

  for (let i = 0; i < 2600; i += 1) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const size = Math.random() * 1.6 + 0.3
      ctx.fillStyle = `${palette.shadow}${Math.round(Math.random() * 0.028 * 255).toString(16).padStart(2, '0')}`
      ctx.fillRect(x, y, size, size)
  }

  const ink = palette.ink
  const accent = palette.accent
  const muted = palette.muted
  const contentWidth = 760
  const contentCenterX = 1088
  const innerLeft = contentCenterX - contentWidth / 2
  const innerRight = contentCenterX + contentWidth / 2

  ctx.strokeStyle = `${palette.shadow}48`
  ctx.lineWidth = 6
  ctx.strokeRect(76, 72, canvas.width - 208, canvas.height - 144)

  ctx.strokeStyle = 'rgba(255, 252, 245, 0.22)'
  ctx.lineWidth = 2
  ctx.strokeRect(92, 88, canvas.width - 240, canvas.height - 176)

  if (theme === 'default') {
    ctx.save()
    ctx.translate(canvas.width - 288, 116)
    ctx.rotate(-0.12)
    ctx.fillStyle = 'rgba(226, 246, 255, 0.72)'
    ctx.fillRect(0, 0, 92, 92)
    ctx.strokeStyle = 'rgba(160, 214, 245, 0.84)'
    ctx.strokeRect(0, 0, 92, 92)
    ctx.restore()

    ctx.save()
    ctx.translate(canvas.width - 192, 166)
    ctx.rotate(0.18)
    ctx.fillStyle = 'rgba(208, 238, 255, 0.66)'
    ctx.fillRect(0, 0, 72, 72)
    ctx.strokeStyle = 'rgba(150, 204, 239, 0.86)'
    ctx.strokeRect(0, 0, 72, 72)
    ctx.restore()
  }

  if (theme === 'forest') {
    ctx.save()
    ctx.translate(canvas.width - 246, 120)
    ctx.rotate(-0.32)
    ctx.fillStyle = 'rgba(106, 150, 90, 0.18)'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(54, -24, 104, 24)
    ctx.quadraticCurveTo(56, 86, 0, 0)
    ctx.fill()
    ctx.restore()
  }

  if (theme === 'sunset') {
    ctx.save()
    ctx.fillStyle = 'rgba(255, 203, 152, 0.28)'
    ctx.fillRect(canvas.width - 352, 120, 220, 20)
    ctx.fillStyle = 'rgba(232, 141, 82, 0.2)'
    ctx.fillRect(canvas.width - 324, 152, 192, 16)
    ctx.restore()
  }

  ctx.fillStyle = accent
  ctx.textAlign = 'center'
  ctx.font = '700 28px "Courier New", monospace'
  ctx.fillText('CURRENT FOCUS // BOOKMARK PANEL', contentCenterX, 138)

  drawWrappedText({
    text: title,
    x: contentCenterX,
    y: 220,
    maxWidth: 640,
    lineHeight: 64,
    maxLines: 2,
    align: 'center',
    font: '700 54px "Trebuchet MS", "PingFang SC", "Microsoft YaHei", sans-serif',
    color: ink,
  })

  const visibleTags = tags.slice(0, 2).map((tag) => String(tag).toUpperCase())
  if (visibleTags.length) {
    ctx.save()
    ctx.font = '700 22px "Courier New", monospace'
    const pillWidths = visibleTags.map((tag) => ctx.measureText(tag).width + 56)
    const totalWidth = pillWidths.reduce((sum, width) => sum + width, 0) + (visibleTags.length - 1) * 18
    let pillOffset = contentCenterX - totalWidth / 2
    ctx.restore()

    visibleTags.forEach((tag, index) => {
      pillOffset += drawPill({
        text: tag,
        x: pillOffset,
        y: 348,
        fill: palette.pillFill,
        stroke: palette.pillStroke,
        color: accent,
      }) + (index < visibleTags.length - 1 ? 18 : 0)
    })
  }

  ctx.strokeStyle = 'rgba(107, 74, 49, 0.22)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(innerLeft, 392)
  ctx.lineTo(innerRight, 392)
  ctx.stroke()

  let y = 474
  items.slice(0, 3).forEach((item, index) => {
    const entry = typeof item === 'string' ? { tag: `0${index + 1}`, title: item, note: '' } : item

    ctx.fillStyle = accent
    ctx.font = '700 18px "Courier New", monospace'
    ctx.fillText(entry.tag.toUpperCase(), innerLeft, y)

    ctx.fillStyle = muted
    ctx.textAlign = 'right'
    ctx.font = '600 16px "Courier New", monospace'
    ctx.fillText(`0${index + 1}`, innerRight, y)
    ctx.textAlign = 'left'

    drawWrappedText({
      text: entry.title,
      x: innerLeft + 18,
      y: y + 30,
      maxWidth: contentWidth - 48,
      lineHeight: 30,
      maxLines: 2,
      font: '700 26px "Trebuchet MS", "PingFang SC", "Microsoft YaHei", sans-serif',
      color: ink,
    })

    drawWrappedText({
      text: entry.note,
      x: innerLeft + 18,
      y: y + 82,
      maxWidth: contentWidth - 48,
      lineHeight: 22,
      maxLines: 2,
      font: '500 16px "Trebuchet MS", "PingFang SC", "Microsoft YaHei", sans-serif',
      color: muted,
    })

    ctx.fillStyle = 'rgba(107, 74, 49, 0.16)'
    ctx.fillRect(innerLeft, y + 8, 3, 100)

    if (index < 2) {
      ctx.strokeStyle = 'rgba(107, 74, 49, 0.16)'
      ctx.beginPath()
      ctx.moveTo(innerLeft, y + 136)
      ctx.lineTo(innerRight, y + 136)
      ctx.stroke()
    }

    y += 176
  })

  ctx.save()
  ctx.translate(canvas.width - 242, 108)
  ctx.rotate(0.11)
  ctx.fillStyle = 'rgba(82, 58, 39, 0.14)'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(112, 18)
  ctx.lineTo(86, 136)
  ctx.lineTo(-10, 118)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  return canvas
}

const createBookmarkAlpha = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1792
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.moveTo(70, 70)
  ctx.lineTo(canvas.width - 150, 70)

  const rightSteps = 12
  for (let i = 0; i <= rightSteps; i += 1) {
    const t = i / rightSteps
    const y = 86 + t * (canvas.height - 172)
    const inset = i % 2 === 0 ? 0 : 18
    ctx.lineTo(canvas.width - 150 - inset - t * 16, y)
  }

  ctx.lineTo(70, canvas.height - 70)
  ctx.closePath()
  ctx.fill()

  return canvas
}

const createBookmarkSimulation = ({ width, height, cols, rows }) => {
  const particles = []
  const constraints = []
  const leftAnchors = []
  const dragTarget = new THREE.Vector3()
  const dragRest = new THREE.Vector3()
  let dragIndex = -1

  const indexFor = (x, y) => y * cols + x
  const dragRadius = height * 0.42

  for (let y = 0; y < rows; y += 1) {
    const v = y / (rows - 1)
    for (let x = 0; x < cols; x += 1) {
      const u = x / (cols - 1)
      const restX = (u - 0.5) * width
      const restY = height * 0.5 - v * height
      const bodyLift = Math.exp(-Math.pow((u - 0.22) / 0.12, 2)) * Math.exp(-Math.pow((v - 0.5) / 0.44, 2)) * 0.05
      const cornerFold = Math.exp(-Math.pow((u - 0.86) / 0.1, 2)) * Math.exp(-Math.pow((v - 0.16) / 0.16, 2)) * 0.085
      const restZ = x === 0 ? 0 : bodyLift + cornerFold

      const particle = {
        pinned: x === 0,
        rest: new THREE.Vector3(restX, restY, restZ),
        position: new THREE.Vector3(restX, restY, restZ),
        previous: new THREE.Vector3(restX, restY, restZ),
      }

      if (x === 0) {
        leftAnchors.push(new THREE.Vector3(restX, restY, 0))
      }

      particles.push(particle)
    }
  }

  const addConstraint = (a, b, stiffness) => {
    constraints.push({
      a,
      b,
      rest: particles[a].rest.distanceTo(particles[b].rest),
      stiffness,
    })
  }

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const current = indexFor(x, y)
      if (x < cols - 1) addConstraint(current, indexFor(x + 1, y), 1)
      if (y < rows - 1) addConstraint(current, indexFor(x, y + 1), 0.985)
      if (x < cols - 1 && y < rows - 1) {
        addConstraint(current, indexFor(x + 1, y + 1), 0.68)
        addConstraint(indexFor(x + 1, y), indexFor(x, y + 1), 0.68)
      }
      if (x < cols - 2) addConstraint(current, indexFor(x + 2, y), 0.24)
      if (y < rows - 2) addConstraint(current, indexFor(x, y + 2), 0.3)
    }
  }

  const pinLeftEdge = () => {
    for (let y = 0; y < rows; y += 1) {
      const particle = particles[indexFor(0, y)]
      particle.position.copy(leftAnchors[y])
      particle.previous.copy(leftAnchors[y])
    }
  }

  const solve = () => {
    for (const constraint of constraints) {
      const first = particles[constraint.a]
      const second = particles[constraint.b]

      let dx = second.position.x - first.position.x
      let dy = second.position.y - first.position.y
      let dz = second.position.z - first.position.z
      let distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (distance < 0.00001) distance = 0.00001

      const difference = ((distance - constraint.rest) / distance) * constraint.stiffness
      const firstWeight = first.pinned ? 0 : 1
      const secondWeight = second.pinned ? 0 : 1
      const totalWeight = firstWeight + secondWeight
      if (!totalWeight) continue

      dx *= difference
      dy *= difference
      dz *= difference

      if (firstWeight) {
        const share = firstWeight / totalWeight
        first.position.x += dx * share
        first.position.y += dy * share
        first.position.z += dz * share
      }

      if (secondWeight) {
        const share = secondWeight / totalWeight
        second.position.x -= dx * share
        second.position.y -= dy * share
        second.position.z -= dz * share
      }
    }
  }

  const applyDrag = () => {
    if (dragIndex === -1) return

    const grabbed = particles[dragIndex]
    grabbed.position.lerp(dragTarget, 0.92)
    grabbed.previous.lerp(grabbed.position, 0.32)

    for (const particle of particles) {
      if (particle.pinned || particle === grabbed) continue

      const distance = particle.rest.distanceTo(dragRest)
      if (distance > dragRadius) continue

      const influence = Math.pow(1 - distance / dragRadius, 2)
      const desiredX = dragTarget.x + (particle.rest.x - dragRest.x) * 0.24
      const desiredY = dragTarget.y + (particle.rest.y - dragRest.y) * 0.2
      const desiredZ = dragTarget.z + (particle.rest.z - dragRest.z) * 0.16

      particle.position.x += (desiredX - particle.position.x) * influence * 0.3
      particle.position.y += (desiredY - particle.position.y) * influence * 0.3
      particle.position.z += (desiredZ - particle.position.z) * influence * 0.3
    }
  }

  const beginDrag = (localPoint) => {
    let nearestIndex = -1
    let nearestDistance = Infinity

    for (let i = 0; i < particles.length; i += 1) {
      const particle = particles[i]
      if (particle.pinned) continue
      const distance = particle.position.distanceToSquared(localPoint)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = i
      }
    }

    if (nearestIndex === -1) return -1
    dragIndex = nearestIndex
    dragTarget.copy(localPoint)
    dragRest.copy(particles[nearestIndex].rest)
    return nearestIndex
  }

  const endDrag = () => {
    dragIndex = -1
  }

  const reset = () => {
    for (const particle of particles) {
      particle.position.copy(particle.rest)
      particle.previous.copy(particle.rest)
    }
    pinLeftEdge()
    dragIndex = -1
  }

  const step = (delta) => {
    const dt = Math.min(delta, 1 / 30)

    for (const particle of particles) {
      if (particle.pinned) continue

      const velocityX = (particle.position.x - particle.previous.x) * 0.992
      const velocityY = (particle.position.y - particle.previous.y) * 0.992
      const velocityZ = (particle.position.z - particle.previous.z) * 0.992

      particle.previous.copy(particle.position)
      particle.position.x += velocityX
      particle.position.y += velocityY
      particle.position.z += velocityZ

      const restore = 0.012 * dt * 60
      particle.position.z += (particle.rest.z - particle.position.z) * restore
    }

    for (let i = 0; i < 10; i += 1) {
      solve()
      applyDrag()
      pinLeftEdge()
    }
  }

  reset()

  return {
    width,
    height,
    cols,
    rows,
    particles,
    beginDrag,
    endDrag,
    isDragging: () => dragIndex !== -1,
    reset,
    setDragTarget: (point) => dragTarget.copy(point),
    step,
  }
}

onMounted(() => {
  if (!canvasHost.value) return

  const host = canvasHost.value
  const simulation = createBookmarkSimulation({ width: 3.3, height: 1.78, cols: 28, rows: 16 })

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 20)
  camera.position.set(0.08, 0, 5.2)
  camera.lookAt(0.22, -0.02, 0)

  const ambient = new THREE.AmbientLight('#eddcbf', 0.9)
  scene.add(ambient)

  const key = new THREE.DirectionalLight('#f7e4bf', 1.02)
  key.position.set(1.6, 2.1, 3.4)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.near = 0.5
  key.shadow.camera.far = 12
  key.shadow.camera.left = -4
  key.shadow.camera.right = 4
  key.shadow.camera.top = 3
  key.shadow.camera.bottom = -3
  scene.add(key)

  const fill = new THREE.DirectionalLight('#8c6a4b', 0.24)
  fill.position.set(-1.2, 0.6, 2.6)
  scene.add(fill)

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 6),
    new THREE.ShadowMaterial({ opacity: 0.26 }),
  )
  floor.position.set(0.25, -0.22, -0.58)
  floor.receiveShadow = true
  scene.add(floor)

  const geometry = new THREE.PlaneGeometry(
    simulation.width,
    simulation.height,
    simulation.cols - 1,
    simulation.rows - 1,
  )

  const map = new THREE.CanvasTexture(createBookmarkTexture(currentTheme.value, props.title, themedTags.value, props.items))
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = renderer.capabilities.getMaxAnisotropy()

  const alphaMap = new THREE.CanvasTexture(createBookmarkAlpha())
  alphaMap.colorSpace = THREE.NoColorSpace

  const palette = getThemePalette(currentTheme.value)
  const material = new THREE.MeshStandardMaterial({
    color: palette.panel,
    map,
    alphaMap,
    transparent: true,
    alphaTest: 0.5,
    roughness: 1,
    metalness: 0,
    side: THREE.DoubleSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)

  const spineMaterial = new THREE.MeshStandardMaterial({ color: palette.spine, roughness: 0.92, metalness: 0.02 })
  const spine = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, simulation.height + 0.1, 0.08),
    spineMaterial,
  )
  spine.position.set(-simulation.width * 0.5 - 0.03, 0, -0.03)
  spine.castShadow = true
  scene.add(spine)

  const rivetGeometry = new THREE.CylinderGeometry(0.032, 0.032, 0.045, 24)
  const rivetMaterial = new THREE.MeshStandardMaterial({ color: palette.rivet, roughness: 0.62, metalness: 0.04 })
  const rivets = [-0.56, 0, 0.56].map((offsetY) => {
    const rivet = new THREE.Mesh(rivetGeometry, rivetMaterial)
    rivet.rotation.z = Math.PI / 2
    rivet.position.set(-simulation.width * 0.5 - 0.005, offsetY, 0.045)
    rivet.castShadow = true
    scene.add(rivet)
    return rivet
  })

  const pointer = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()
  const dragPlane = new THREE.Plane()
  const dragHit = new THREE.Vector3()
  const cameraDirection = new THREE.Vector3()

  let lastSplashAt = 0

  const applyTheme = () => {
    const nextPalette = getThemePalette(currentTheme.value)
    map.image = createBookmarkTexture(currentTheme.value, props.title, themedTags.value, props.items)
    map.needsUpdate = true
    material.color.set(nextPalette.panel)
    spineMaterial.color.set(nextPalette.spine)
    rivetMaterial.color.set(nextPalette.rivet)
    ambient.color.set(currentTheme.value === 'default' ? '#eff9ff' : currentTheme.value === 'forest' ? '#eef6e8' : '#fff1e4')
    key.color.set(currentTheme.value === 'default' ? '#ecfbff' : currentTheme.value === 'forest' ? '#f3f8ea' : '#ffe5c8')
    fill.color.set(currentTheme.value === 'default' ? '#5b9bcc' : currentTheme.value === 'forest' ? '#62895f' : '#bf6d3f')
  }

  const updateGeometry = () => {
    const positions = geometry.attributes.position.array
    for (let i = 0; i < simulation.particles.length; i += 1) {
      const particle = simulation.particles[i]
      const offset = i * 3
      positions[offset] = particle.position.x
      positions[offset + 1] = particle.position.y
      positions[offset + 2] = particle.position.z
    }
    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
  }

  const resize = () => {
    const { width, height } = host.getBoundingClientRect()
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  const updatePointer = (event) => {
    const rect = renderer.domElement.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  const onPointerDown = (event) => {
    if (event.button !== 0) return
    updatePointer(event)
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObject(mesh, false)[0]
    if (!hit) return

    const localPoint = mesh.worldToLocal(hit.point.clone())
    const index = simulation.beginDrag(localPoint)
    if (index === -1) return

    camera.getWorldDirection(cameraDirection)
    dragPlane.setFromNormalAndCoplanarPoint(cameraDirection, hit.point)
    renderer.domElement.style.cursor = 'grabbing'
    renderer.domElement.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (!simulation.isDragging()) {
      renderer.domElement.style.cursor = 'grab'
      return
    }

    updatePointer(event)
    raycaster.setFromCamera(pointer, camera)
    if (raycaster.ray.intersectPlane(dragPlane, dragHit)) {
      const localPoint = mesh.worldToLocal(dragHit.clone())
      simulation.setDragTarget(localPoint)

      if (currentTheme.value === 'default' && performance.now() - lastSplashAt > 78) {
        const rect = renderer.domElement.getBoundingClientRect()
        spawnSeaSplash(event.clientX - rect.left, event.clientY - rect.top)
        lastSplashAt = performance.now()
      }
    }
  }

  const releasePointer = (event) => {
    simulation.endDrag()
    renderer.domElement.style.cursor = 'grab'
    if (event?.pointerId != null && renderer.domElement.hasPointerCapture(event.pointerId)) {
      renderer.domElement.releasePointerCapture(event.pointerId)
    }
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown)
  renderer.domElement.addEventListener('pointermove', onPointerMove)
  renderer.domElement.addEventListener('pointerup', releasePointer)
  renderer.domElement.addEventListener('pointercancel', releasePointer)

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)
  resize()
  updateGeometry()

  const clock = new THREE.Clock()
  const animate = () => {
    const delta = clock.getDelta()
    simulation.step(delta)
    updateGeometry()
    renderer.render(scene, camera)
    runtime.animationId = window.requestAnimationFrame(animate)
  }

  runtime = {
    animationId: window.requestAnimationFrame(animate),
    resizeObserver,
    renderer,
    geometry,
    material,
    map,
    alphaMap,
    simulation,
    applyTheme,
    spineMaterial,
    rivetGeometry,
    rivetMaterial,
    rivets,
    handlers: { onPointerDown, onPointerMove, releasePointer },
  }

  applyTheme()
})

const themeObserver = new MutationObserver(() => {
  currentTheme.value = document.documentElement.dataset.theme || 'default'
})

watch([currentTheme, locale], () => {
  runtime?.applyTheme()
})

onMounted(() => {
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
})

onBeforeUnmount(() => {
  if (!runtime) return

  themeObserver.disconnect()
  runtime.simulation.reset()
  window.cancelAnimationFrame(runtime.animationId)
  runtime.resizeObserver.disconnect()
  splashTimers.forEach((timer) => window.clearTimeout(timer))
  splashTimers.clear()
  splashes.value = []

  const { renderer, handlers } = runtime
  renderer.domElement.removeEventListener('pointerdown', handlers.onPointerDown)
  renderer.domElement.removeEventListener('pointermove', handlers.onPointerMove)
  renderer.domElement.removeEventListener('pointerup', handlers.releasePointer)
  renderer.domElement.removeEventListener('pointercancel', handlers.releasePointer)
  renderer.domElement.remove()
  renderer.dispose()
  runtime.geometry.dispose()
  runtime.material.dispose()
  runtime.map.dispose()
  runtime.alphaMap.dispose()
  runtime.spineMaterial.dispose()
  runtime.rivetGeometry.dispose()
  runtime.rivetMaterial.dispose()
  runtime = null
})
</script>

<style scoped>
.bookmark-shell {
  position: relative;
  z-index: 1;
  height: 100%;
}

.bookmark-stage {
  position: relative;
  min-height: 304px;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  padding: 14px;
  background:
    radial-gradient(circle at 50% 12%, rgba(255, 238, 208, 0.1), transparent 26%),
    linear-gradient(180deg, rgba(62, 45, 33, 0.98), rgba(34, 26, 20, 1));
  border: 1px solid rgba(126, 94, 61, 0.3);
  box-shadow:
    inset 0 1px 0 rgba(255, 239, 209, 0.08),
    inset 0 -20px 40px rgba(0, 0, 0, 0.24),
    0 26px 48px rgba(31, 23, 17, 0.24);
}

.bookmark-stage.theme-default {
  background:
    radial-gradient(circle at 22% 22%, rgba(228, 245, 255, 0.22), transparent 30%),
    linear-gradient(180deg, rgba(18, 72, 116, 0.92), rgba(10, 46, 77, 0.98));
  border-color: rgba(129, 185, 221, 0.36);
}

.bookmark-stage.theme-forest {
  background:
    radial-gradient(circle at 24% 20%, rgba(216, 239, 206, 0.16), transparent 28%),
    linear-gradient(180deg, rgba(40, 66, 35, 0.96), rgba(25, 45, 24, 1));
  border-color: rgba(143, 178, 132, 0.34);
}

.bookmark-stage.theme-sunset {
  background:
    radial-gradient(circle at 22% 18%, rgba(255, 221, 178, 0.16), transparent 28%),
    linear-gradient(180deg, rgba(96, 47, 22, 0.96), rgba(59, 28, 18, 1));
  border-color: rgba(226, 155, 108, 0.34);
}

.bookmark-stage::before {
  content: '';
  position: absolute;
  inset: 14px;
  border-radius: 18px;
  box-shadow: inset 0 0 0 1px rgba(255, 228, 188, 0.06);
  background:
    linear-gradient(180deg, rgba(255, 240, 214, 0.04), transparent 18%, transparent 76%, rgba(0, 0, 0, 0.16)),
    repeating-linear-gradient(90deg, rgba(255, 226, 184, 0.03) 0 1px, transparent 1px 24px);
  pointer-events: none;
}

.bookmark-canvas {
  width: 100%;
  height: 100%;
  min-height: 276px;
}

.bookmark-canvas :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
}

.bookmark-props,
.bookmark-splashes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bookmark-prop {
  position: absolute;
  display: block;
}

.theme-default .prop-a,
.theme-default .prop-b,
.theme-default .prop-c {
  background: linear-gradient(180deg, rgba(223, 244, 255, 0.9), rgba(176, 222, 245, 0.72));
  border: 1px solid rgba(255, 255, 255, 0.42);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.42), 0 10px 20px rgba(7, 39, 69, 0.16);
  border-radius: 18px;
}

.theme-default .prop-a {
  width: 44px;
  height: 44px;
  top: 24px;
  right: 34px;
  transform: rotate(-12deg);
}

.theme-default .prop-b {
  width: 32px;
  height: 32px;
  top: 74px;
  right: 92px;
  transform: rotate(14deg);
}

.theme-default .prop-c {
  width: 12px;
  height: 12px;
  top: 54px;
  right: 132px;
  border-radius: 50%;
}

.theme-forest .prop-a,
.theme-forest .prop-b,
.theme-forest .prop-c {
  background: linear-gradient(180deg, rgba(181, 220, 164, 0.86), rgba(101, 145, 86, 0.72));
  box-shadow: 0 10px 18px rgba(18, 37, 18, 0.18);
}

.theme-forest .prop-a {
  width: 28px;
  height: 72px;
  top: 26px;
  right: 42px;
  border-radius: 100% 0 100% 0;
  transform: rotate(-18deg);
}

.theme-forest .prop-b {
  width: 22px;
  height: 58px;
  top: 56px;
  right: 86px;
  border-radius: 100% 0 100% 0;
  transform: rotate(8deg);
}

.theme-forest .prop-c {
  width: 10px;
  height: 10px;
  top: 42px;
  right: 130px;
  border-radius: 50%;
}

.theme-sunset .prop-a,
.theme-sunset .prop-b,
.theme-sunset .prop-c {
  background: linear-gradient(180deg, rgba(255, 211, 161, 0.92), rgba(224, 128, 67, 0.7));
  box-shadow: 0 10px 18px rgba(58, 24, 14, 0.18);
}

.theme-sunset .prop-a {
  width: 78px;
  height: 16px;
  top: 34px;
  right: 30px;
  border-radius: 999px;
}

.theme-sunset .prop-b {
  width: 56px;
  height: 12px;
  top: 58px;
  right: 84px;
  border-radius: 999px;
}

.theme-sunset .prop-c {
  width: 22px;
  height: 22px;
  top: 24px;
  right: 126px;
  border-radius: 50%;
}

.splash-drop {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.92), rgba(166, 220, 248, 0.72));
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.28);
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.6);
  animation: sea-splash 720ms ease-out forwards;
  animation-delay: var(--delay);
}

@keyframes sea-splash {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.4);
  }

  20% {
    opacity: 0.92;
  }

  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.08);
  }
}

.bookmark-overlay {
  position: absolute;
  left: 26px;
  right: 26px;
  bottom: 20px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding: 10px 14px;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(41, 30, 23, 0.18), rgba(24, 18, 14, 0.42));
  border: 1px solid rgba(255, 226, 184, 0.07);
  backdrop-filter: blur(6px);
}

.bookmark-overlay p,
.bookmark-overlay span {
  margin: 0;
}

.bookmark-overlay p {
  color: #edd7b6;
  font-weight: 700;
  font-size: 13px;
  line-height: 1.5;
}

.bookmark-overlay span {
  color: rgba(240, 220, 192, 0.72);
  font-size: 12px;
  line-height: 1.5;
  text-align: right;
}

@media (max-width: 768px) {
  .bookmark-stage {
    min-height: 276px;
  }

  .bookmark-canvas {
    min-height: 248px;
  }

  .bookmark-overlay {
    flex-direction: column;
    align-items: start;
  }

  .bookmark-overlay span {
    text-align: left;
  }
}
</style>
