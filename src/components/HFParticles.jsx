import { Component, Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { carModelUrl, SMALL_SCREEN_QUERY } from '../data/models'

const FORM_DURATION = 1.7 // seconds for the particles to assemble into "HF"
const EXIT_DURATION = 0.75 // seconds for the particles to scatter away

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uForm;
  uniform float uExit;
  uniform float uPixelRatio;
  attribute vec3 aStart;
  attribute float aRand;
  attribute float aSize;
  varying float vAlpha;
  varying float vRand;

  float easeOutCubic(float t) { return 1.0 - pow(1.0 - t, 3.0); }

  void main() {
    // Each particle starts a little later than the last so the letters "draw in".
    float delay = aRand * 0.45;
    float f = easeOutCubic(clamp((uForm - delay) / 0.55, 0.0, 1.0));
    vec3 p = mix(aStart, position, f);

    // Gentle shimmer while idle; larger drift while still scattered.
    float t = uTime * 0.6 + aRand * 60.0;
    p += vec3(sin(t), cos(t * 0.9), sin(t * 0.7)) * mix(0.08, 0.006, f);

    // Exit: burst outward from the centre and towards the camera.
    float e = uExit * uExit;
    vec2 radial = normalize(position.xy + vec2(0.0001));
    p += vec3(radial * (1.5 + aRand * 2.5), 2.5 + aRand * 3.5) * e;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (13.0 / -mv.z);

    float twinkle = 0.75 + 0.25 * sin(uTime * 2.0 + aRand * 90.0);
    vAlpha = mix(0.3, 1.0, f) * twinkle * (1.0 - uExit);
    vRand = aRand;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vRand;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float soft = smoothstep(0.5, 0.08, d);
    vec3 color = mix(uColorA, uColorB, step(0.82, vRand));
    gl_FragColor = vec4(color, soft * vAlpha * uOpacity);
  }
`

/** Sample the filled pixels of the HF logo mark into 3D target points. */
function sampleMark(mark, count, width) {
  const W = 640
  const H = Math.round(W * (mark.naturalHeight / mark.naturalWidth || 0.7))
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(mark, 0, 0, W, H)

  const { data } = ctx.getImageData(0, 0, W, H)
  const solid = (x, y) => x >= 0 && y >= 0 && x < W && y < H && data[(y * W + x) * 4 + 3] > 128
  const filled = []
  const edges = []
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (!solid(x, y)) continue
      filled.push(x, y)
      // Pixels next to an empty pixel trace the outline of the mark.
      if (!solid(x - 3, y) || !solid(x + 3, y) || !solid(x, y - 3) || !solid(x, y + 3)) edges.push(x, y)
    }
  }

  // ~30% of particles trace the outline so cuts and the slanted F stay crisp.
  const points = new Float32Array(count * 3)
  const scale = width / W
  const edgeCount = edges.length ? Math.floor(count * 0.3) : 0
  for (let i = 0; i < count; i++) {
    const source = i < edgeCount ? edges : filled
    const j = Math.floor(Math.random() * (source.length / 2)) * 2
    points[i * 3] = (source[j] + Math.random() * 2 - W / 2) * scale
    points[i * 3 + 1] = -(source[j + 1] + Math.random() * 2 - H / 2) * scale
    points[i * 3 + 2] = (Math.random() - 0.5) * 0.2 // a little thickness for depth
  }
  return points
}

function randomInSphere(radius) {
  const v = new THREE.Vector3().randomDirection().multiplyScalar(radius * Math.cbrt(Math.random()))
  return [v.x, v.y, v.z]
}

function buildGeometry(targets, count, { scatter, sizeRange }) {
  const starts = new Float32Array(count * 3)
  const rands = new Float32Array(count)
  const sizes = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    starts.set(scatter(i), i * 3)
    rands[i] = Math.random()
    sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0])
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(targets, 3))
  geometry.setAttribute('aStart', new THREE.BufferAttribute(starts, 3))
  geometry.setAttribute('aRand', new THREE.BufferAttribute(rands, 1))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  return geometry
}

function makeMaterial(opacity) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uForm: { value: 0 },
      uExit: { value: 0 },
      uOpacity: { value: opacity },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColorA: { value: new THREE.Color('#9fbeca') },
      uColorB: { value: new THREE.Color('#eee9df') },
    },
  })
}

/** Build the letter cloud and the ambient dust (random, so done once outside render). */
function createParticles(isSmall, mark) {
  const letterCount = isSmall ? 2800 : 7000
  const dustCount = isSmall ? 220 : 420
  const letterGeo = buildGeometry(sampleMark(mark, letterCount, isSmall ? 2.5 : 3.0), letterCount, {
    scatter: () => randomInSphere(6),
    sizeRange: isSmall ? [0.7, 1.5] : [0.9, 2.0],
  })
  const dustTargets = new Float32Array(dustCount * 3)
  for (let i = 0; i < dustCount; i++) {
    dustTargets.set([(Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, -1 - Math.random() * 5], i * 3)
  }
  const dustGeo = buildGeometry(dustTargets, dustCount, {
    scatter: (i) => [dustTargets[i * 3], dustTargets[i * 3 + 1], dustTargets[i * 3 + 2]],
    sizeRange: [0.6, 1.6],
  })
  return {
    letters: { geometry: letterGeo, material: makeMaterial(1) },
    dust: { geometry: dustGeo, material: makeMaterial(0.35) },
  }
}

function ParticleField({ isSmall, mark, exiting, onFormed, onExited }) {
  const group = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const clock = useRef({ start: null, exitStart: null, formed: false, exited: false })

  const { letters, dust } = useMemo(() => createParticles(isSmall, mark), [isSmall, mark])

  useEffect(() => () => {
    letters.geometry.dispose()
    letters.material.dispose()
    dust.geometry.dispose()
    dust.material.dispose()
  }, [letters, dust])

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    const now = state.clock.elapsedTime
    const c = clock.current
    if (c.start === null) c.start = now

    const form = Math.min((now - c.start) / FORM_DURATION, 1)
    if (form >= 1 && !c.formed) {
      c.formed = true
      onFormed?.()
    }

    let exit = 0
    if (exiting) {
      if (c.exitStart === null) c.exitStart = now
      exit = Math.min((now - c.exitStart) / EXIT_DURATION, 1)
      if (exit >= 1 && !c.exited) {
        c.exited = true
        onExited?.()
      }
    }

    for (const m of [letters.material, dust.material]) {
      m.uniforms.uTime.value = now
      m.uniforms.uForm.value = m === dust.material ? 1 : form
      m.uniforms.uExit.value = exit
    }

    // Slow 3D sway plus a soft pointer parallax.
    const g = group.current
    const targetY = Math.sin(now * 0.35) * 0.22 + pointer.current.x * 0.25
    const targetX = pointer.current.y * 0.12
    g.rotation.y += (targetY - g.rotation.y) * Math.min(delta * 3, 1)
    g.rotation.x += (targetX - g.rotation.x) * Math.min(delta * 3, 1)
  })

  return (
    <group ref={group} position={[0, isSmall ? 0.3 : 0.4, 0]}>
      <points geometry={dust.geometry} material={dust.material} />
      <points geometry={letters.geometry} material={letters.material} />
    </group>
  )
}

/** Mounts only once the hero's car model is in the R3F loader cache. */
function ModelWarmup({ url, onReady }) {
  useLoader(GLTFLoader, url)
  useEffect(() => { onReady?.() }, [onReady])
  return null
}

class WebGLBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError?.()
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export default function HFParticles({ mark, exiting, onFormed, onExited, onModelReady, onError }) {
  const isSmall = useMemo(() => window.matchMedia(SMALL_SCREEN_QUERY).matches, [])

  return (
    <WebGLBoundary onError={onError} fallback={null}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: isSmall ? 60 : 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ParticleField isSmall={isSmall} mark={mark} exiting={exiting} onFormed={onFormed} onExited={onExited} />
        {/* A failed model load must not take the particles down with it. */}
        <WebGLBoundary onError={onModelReady} fallback={null}>
          <Suspense fallback={null}>
            <ModelWarmup url={carModelUrl(isSmall)} onReady={onModelReady} />
          </Suspense>
        </WebGLBoundary>
      </Canvas>
    </WebGLBoundary>
  )
}
