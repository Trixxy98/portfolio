import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three'

const LOOK = new THREE.Vector3(0.2, -0.08, 0)
const CAMERA_AIM = new THREE.Vector3()
const LINE = '#79bfff'
const FILL = '#0c304a'
const REAL_HOLD = 0.8
const TRANSITION_DURATION = 2.4

function labelFor(angle) {
  const a = Math.abs(angle)
  if (a < 0.85) return 'AERODYNAMICS'
  if (a < 2.25) return 'SUSPENSION'
  return 'POWER UNIT'
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(query).matches,
  )
  useEffect(() => {
    const media = window.matchMedia(query)
    const apply = () => setMatches(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [query])
  return matches
}

function prepareCar(root, staticMode) {
  const box = new THREE.Box3().setFromObject(root)
  const center = box.getCenter(new THREE.Vector3())
  root.position.sub(center)
  const layers = []
  const meshes = []
  root.traverse((obj) => {
    if (obj.isMesh) meshes.push(obj)
  })

  meshes.forEach((obj) => {
    const real = obj.material.clone()
    real.side = THREE.DoubleSide
    real.metalness = 0.42
    real.roughness = 0.32
    real.transparent = true
    real.opacity = staticMode ? 0 : 1
    real.depthWrite = !staticMode
    real.visible = !staticMode
    obj.material = real

    const fill = new THREE.MeshBasicMaterial({
      color: FILL,
      transparent: true,
      opacity: staticMode ? 0.22 : 0,
      depthWrite: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    })
    fill.visible = staticMode
    const blueprintSurface = new THREE.Mesh(obj.geometry, fill)
    blueprintSurface.renderOrder = 1
    obj.add(blueprintSurface)

    const edges = new THREE.EdgesGeometry(obj.geometry, 24)
    const outline = new THREE.LineBasicMaterial({
      color: LINE,
      transparent: true,
      opacity: staticMode ? 0.7 : 0,
      depthWrite: false,
    })
    outline.visible = staticMode
    const edgeLines = new THREE.LineSegments(edges, outline)
    edgeLines.renderOrder = 2
    obj.add(edgeLines)
    layers.push({ real, fill, outline })
  })
  return { root, layers }
}

function setCarTransition(layers, progress) {
  for (const { real, fill, outline } of layers) {
    real.opacity = 1 - progress
    real.depthWrite = progress === 0
    real.visible = progress < 1
    fill.opacity = 0.22 * progress
    fill.visible = progress > 0
    outline.opacity = 0.7 * progress
    outline.visible = progress > 0
  }
}

function CarModel({ isSmallScreen, staticMode, introComplete }) {
  const gltf = useLoader(GLTFLoader, isSmallScreen
    ? '/models/f1-2026-concept-mobile.glb'
    : '/models/f1-2026-concept.glb')
  const { root: model, layers } = useMemo(() => {
    const root = gltf.scene.clone(true)
    // The supplied model is millimetre-scale and points along X, while the
    // scene's orbit and guides expect a roughly 5-metre car along Z.
    root.rotation.y = -Math.PI / 2
    root.scale.setScalar(0.001)
    return prepareCar(root, staticMode)
  }, [gltf, staticMode])
  const transitionStart = useRef(null)

  useEffect(() => { transitionStart.current = null }, [model])

  useFrame((state) => {
    if (staticMode || !introComplete) return
    if (transitionStart.current === null) transitionStart.current = state.clock.elapsedTime
    const t = THREE.MathUtils.clamp(
      (state.clock.elapsedTime - transitionStart.current - REAL_HOLD) / TRANSITION_DURATION,
      0, 1,
    )
    const progress = t * t * (3 - 2 * t)

    setCarTransition(layers, progress)
  })

  useEffect(() => () => {
    model.traverse((obj) => {
      if (obj.isLineSegments) {
        obj.geometry.dispose()
        obj.material.dispose()
      } else if (obj.isMesh) {
        obj.material.dispose()
      }
    })
  }, [model])
  return <primitive object={model} />
}

function MeasurementGuides() {
  const geometry = useMemo(() => {
    const points = []
    const line = (x1, z1, x2, z2) => {
      points.push(x1, -0.59, z1, x2, -0.59, z2)
    }

    // Dimension lines around the car's footprint, with blueprint-style ticks.
    for (const x of [-1.18, 1.18]) {
      line(x, -2.92, x, 2.92)
      for (let z = -2.9; z <= 2.91; z += 0.2) {
        const tick = Math.round(z * 10) % 10 === 0 ? 0.12 : 0.055
        line(x - tick, z, x + tick, z)
      }
    }
    for (const z of [-2.92, 2.92]) {
      line(-1.18, z, 1.18, z)
      for (let x = -1.1; x <= 1.11; x += 0.2) {
        const tick = Math.round(x * 10) % 10 === 0 ? 0.12 : 0.055
        line(x, z - tick, x, z + tick)
      }
    }

    const result = new THREE.BufferGeometry()
    result.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return result
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <lineSegments geometry={geometry} position={[LOOK.x, 0, 0]}>
      <lineBasicMaterial color="#3986bb" transparent opacity={0.3} depthWrite={false} />
    </lineSegments>
  )
}

function Scan({ active }) {
  const ref = useRef(null)
  useFrame((state) => {
    if (!active || !ref.current) return
    ref.current.position.z = Math.sin(state.clock.elapsedTime * 0.65) * 2.45
  })
  if (!active) return null
  return (
    <mesh ref={ref} position={[0, 0.15, 0]}>
      <planeGeometry args={[2.3, 0.045]} />
      <meshBasicMaterial
        color="#7ec8ff"
        transparent
        opacity={0.09}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function Rig({ pointer, staticMode, isSmallScreen, onLabel }) {
  const announced = useRef('')

  useFrame((state) => {
    const target = LOOK
    if (staticMode) {
      state.camera.position.set(target.x + 3.1, target.y + 1.25, target.z + 5.4)
    } else {
      const t = state.clock.elapsedTime * 0.18
      const radius = 6.4
      const sway = pointer.current.x * 0.35
      const lift = pointer.current.y * -0.2
      state.camera.position.set(
        target.x + Math.sin(t) * radius + sway,
        target.y + 1.35 + Math.sin(t * 0.6) * 0.28 + lift,
        target.z + Math.cos(t) * radius,
      )
    }

    const angle = Math.atan2(state.camera.position.x - target.x, state.camera.position.z - target.z)
    const offset = isSmallScreen ? 0 : 0.8
    CAMERA_AIM.set(
      target.x - Math.cos(angle) * offset,
      target.y + (isSmallScreen ? 0.65 : 0.18),
      target.z + Math.sin(angle) * offset,
    )
    state.camera.lookAt(CAMERA_AIM)
    if (staticMode) {
      return
    }
    const next = labelFor(angle)
    if (next !== announced.current) {
      announced.current = next
      onLabel(next)
    }
  })

  return null
}

function Scene({ pointer, staticMode, isSmallScreen, introComplete, onLabel }) {
  return (
    <>
      <fog attach="fog" args={['#061018', 12, 22]} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 6, 5]} intensity={2.2} color="#d6e9ff" />
      <directionalLight position={[-3, 2, -4]} intensity={0.8} color="#5a9fd3" />
      <gridHelper args={[22, 44, '#153850', '#0b2231']} position={[LOOK.x, -0.63, 0]} />
      {!isSmallScreen && <MeasurementGuides />}
      <Suspense fallback={null}>
        <group position={LOOK.toArray()} scale={isSmallScreen ? 0.34 : 0.6}>
          <CarModel isSmallScreen={isSmallScreen} staticMode={staticMode} introComplete={introComplete} />
          <Scan active={!staticMode} />
        </group>
      </Suspense>
      <Rig pointer={pointer} staticMode={staticMode} isSmallScreen={isSmallScreen} onLabel={onLabel} />
    </>
  )
}

export default function BlueprintCar({ introComplete = true }) {
  const staticMode = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isSmallScreen = useMediaQuery('(max-width: 767px)')
  const pointer = useRef({ x: 0, y: 0 })
  const [label, setLabel] = useState('AERODYNAMICS')

  useEffect(() => {
    if (staticMode) return undefined
    const onMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [staticMode])

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-screen">
      <Canvas
        camera={{ position: [4.2, 1.2, 6.4], fov: isSmallScreen ? 40 : 30 }}
        gl={{ antialias: true, alpha: true }}
        dpr={isSmallScreen ? 1 : [1, 1.5]}
        frameloop={staticMode ? 'demand' : 'always'}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x061018, 1)
          camera.lookAt(LOOK)
        }}
      >
        <Scene pointer={pointer} staticMode={staticMode} isSmallScreen={isSmallScreen} introComplete={introComplete} onLabel={setLabel} />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(6,16,24,0.78)_0%,transparent_52%)]" />
      <p className="absolute top-28 right-8 font-mono text-[10px] tracking-[0.28em] text-[#9fd6ff]/75">
        {label}
      </p>
    </div>
  )
}
