import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { CAR_MODEL_URL } from '../data/models'

const LOOK = new THREE.Vector3(0.2, -0.08, 0)
const GRID_Y = -0.63
const GRID_SIZE = 22
const GRID_DIVISIONS = 44
const CAR_SCALE = 0.6
// Car length in the car group's units, and the grid floor in those units.
const CAR_LENGTH = 4.8
const CAR_FLOOR = (GRID_Y - LOOK.y) / CAR_SCALE
const CAMERA_AIM = new THREE.Vector3()
const LINE = '#9fbeca'
const FILL = '#29404a'
const FILL_OPACITY = 0.22
const LINE_OPACITY = 0.7
// How far the camera aims to the left of the car, pushing it right of the copy.
const AIM_OFFSET = 1.15
const ORBIT_SPEED = 0.14 // radians per second
const DRAW_DURATION = 2.4 // seconds for the "plotter" to draw the car, nose to tail
const DRAW_MARGIN = 0.15 // local units past each end, so the pen starts/ends off the car
const GRID_SPEED = 0.55 // world units per second the floor slides back

/**
 * Engineering callouts pinned to the car. `at` is a point on the car's
 * bounding box: x and z run -1..1 across the half-width / half-length (nose at
 * +z), y runs 0..1 from the floor to the roof line. Exactly one shows at a
 * time, picked by the camera's angle around the car (0 = looking at the nose).
 * Figures are Porsche's published numbers for the 992 GT3 RS.
 */
const CALLOUTS = [
  { id: 'front', title: 'Downforce', detail: '860 kg at 285 km/h', at: [0, 0.22, 0.97], when: (a) => Math.abs(a) < 0.6 },
  { id: 'arch-r', title: 'Front wheel arches', detail: 'Louvred to vent pressure', at: [0.92, 0.55, 0.52], when: (a) => a >= 0.6 && a < 1.9 },
  { id: 'arch-l', title: 'Front wheel arches', detail: 'Louvred to vent pressure', at: [-0.92, 0.55, 0.52], when: (a) => a <= -0.6 && a > -1.9 },
  { id: 'wing', title: 'Swan-neck rear wing', detail: 'With DRS', at: [0, 1, -0.8], when: (a) => Math.abs(a) >= 1.9 && Math.abs(a) < 2.6 },
  { id: 'engine', title: 'Flat-six', detail: '4.0 L · 525 PS · 9,000 rpm', at: [0, 0.62, -0.93], when: (a) => Math.abs(a) >= 2.6 },
]

/** Scale the car to CAR_LENGTH along Z, centre it, and stand it on the grid. */
function fitCar(root) {
  const size = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3())
  root.scale.setScalar(CAR_LENGTH / size.z)
  const box = new THREE.Box3().setFromObject(root)
  const center = box.getCenter(new THREE.Vector3())
  root.position.set(-center.x, CAR_FLOOR - box.min.y, -center.z)
  // The car's box in the car group's units, after fitting.
  return new THREE.Box3().setFromObject(root)
}

function prepareCar(root, plotted) {
  const box = fitCar(root)
  // Keeps world z >= -constant; CarModel sweeps the constant to draw the car.
  const clip = new THREE.Plane(new THREE.Vector3(0, 0, 1), plotted ? -Infinity : Infinity)
  const clippingPlanes = plotted ? [clip] : null
  const meshes = []
  root.traverse((obj) => {
    if (obj.isMesh) meshes.push(obj)
  })

  meshes.forEach((obj) => {
    // Each part is drawn as a faint fill plus its edges; there is no solid car.
    // Hidden-line removal: the fill writes depth (pushed slightly back so the
    // part's own edges still pass), hiding edges behind the body such as the
    // cabin interior, so only the outer shell reads as a drawing.
    obj.material = new THREE.MeshBasicMaterial({
      color: FILL,
      transparent: true,
      opacity: FILL_OPACITY,
      depthWrite: true,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      clippingPlanes,
    })
    obj.renderOrder = 1

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(obj.geometry, 24),
      new THREE.LineBasicMaterial({ color: LINE, transparent: true, opacity: LINE_OPACITY, depthWrite: false, clippingPlanes }),
    )
    edges.renderOrder = 2
    obj.add(edges)
  })
  return { root, box, clip }
}

/**
 * Loads the car and "plots" it: a clipping plane sweeps from nose to tail so
 * the drawing appears as if a pen were drawing it. Shares progress via `plotRef`.
 */
function CarModel({ staticMode, plotRef }) {
  const gltf = useLoader(GLTFLoader, CAR_MODEL_URL)
  const { root: model, box, clip } = useMemo(
    // The model is pre-aligned (nose at +Z) by scripts/prepare-car-model.mjs.
    () => prepareCar(gltf.scene.clone(true), !staticMode),
    [gltf, staticMode],
  )

  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    plotRef.current = { box, clip, start: null, front: box.max.z + DRAW_MARGIN, done: staticMode, doneAt: 0 }
    // With reduced motion the canvas renders on demand: draw once more so the
    // callout is placed now that the car's box is known.
    invalidate()
  }, [box, clip, staticMode, plotRef, invalidate])

  useFrame((state) => {
    const p = plotRef.current
    if (!p || p.done) return
    const now = state.clock.elapsedTime
    if (p.start === null) p.start = now
    const t = THREE.MathUtils.clamp((now - p.start) / DRAW_DURATION, 0, 1)
    const eased = t * t * (3 - 2 * t)
    p.front = THREE.MathUtils.lerp(box.max.z + DRAW_MARGIN, box.min.z - DRAW_MARGIN, eased)
    p.clip.constant = -(LOOK.z + p.front * CAR_SCALE)
    if (t === 1) {
      p.done = true
      p.doneAt = now
      p.clip.constant = Infinity
    }
  })

  useEffect(() => () => {
    model.traverse((obj) => {
      if (obj.isLineSegments) obj.geometry.dispose()
      if (obj.isMesh || obj.isLineSegments) obj.material.dispose()
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
      <lineBasicMaterial color="#9fbeca" transparent opacity={0.3} depthWrite={false} />
    </lineSegments>
  )
}

/** The floor slides back under the car, so it reads as driving forward. */
function MovingGrid({ active }) {
  const ref = useRef(null)
  useFrame((state) => {
    if (!active || !ref.current) return
    const cell = GRID_SIZE / GRID_DIVISIONS
    ref.current.position.z = -((state.clock.elapsedTime * GRID_SPEED) % cell)
  })
  return <gridHelper ref={ref} args={[GRID_SIZE, GRID_DIVISIONS, '#38505b', '#263943']} position={[LOOK.x, GRID_Y, 0]} />
}

/**
 * The plotter's "pen": a scan gate the size of the car's cross-section that
 * rides the drawing front while the car is being drawn, then disappears.
 */
function Pen({ plotRef }) {
  const group = useRef(null)
  const frame = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0], 3))
    return geometry
  }, [])
  useEffect(() => () => frame.dispose(), [frame])

  useFrame(() => {
    const p = plotRef.current
    if (!group.current) return
    if (!p || p.done) {
      group.current.visible = false
      return
    }
    const { box } = p
    group.current.visible = true
    group.current.position.set((box.min.x + box.max.x) / 2, (box.min.y + box.max.y) / 2, p.front)
    group.current.scale.set(box.max.x - box.min.x + 0.3, box.max.y - box.min.y + 0.15, 1)
  })

  return (
    <group ref={group} visible={false}>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={LINE} transparent opacity={0.06} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <lineLoop geometry={frame}>
        <lineBasicMaterial color={LINE} transparent opacity={0.55} depthWrite={false} />
      </lineLoop>
    </group>
  )
}

/** Once the car is drawn, a faint light bar sweeps it slowly like a scanner. */
function Scan({ active, plotRef }) {
  const ref = useRef(null)
  const material = useRef(null)
  useFrame((state) => {
    const p = plotRef.current
    if (!active || !ref.current) return
    if (!p?.done) {
      material.current.opacity = 0
      return
    }
    // Starts at the tail, where the pen finished.
    ref.current.position.z = -Math.cos((state.clock.elapsedTime - p.doneAt) * 0.65) * 2.45
    material.current.opacity = 0.09
  })
  if (!active) return null
  return (
    <mesh ref={ref} position={[0, 0.15, 0]}>
      <planeGeometry args={[2.3, 0.045]} />
      <meshBasicMaterial
        ref={material}
        color="#9fbeca"
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function Rig({ pointer, staticMode }) {
  useFrame((state) => {
    const target = LOOK
    if (staticMode) {
      state.camera.position.set(target.x + 3.1, target.y + 1.25, target.z + 5.4)
    } else {
      const t = state.clock.elapsedTime * ORBIT_SPEED
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
    CAMERA_AIM.set(
      target.x - Math.cos(angle) * AIM_OFFSET,
      target.y + 0.18,
      target.z + Math.sin(angle) * AIM_OFFSET,
    )
    state.camera.lookAt(CAMERA_AIM)
  })

  return null
}

const PROJECTED = new THREE.Vector3()

/**
 * Positions the HTML callouts (rendered outside the canvas) over their points
 * on the car each frame, writing straight to the DOM to avoid React renders.
 */
function CalloutTracker({ plotRef, nodesRef }) {
  useFrame((state) => {
    const p = plotRef.current
    if (!p) return
    const { box, done } = p
    const { camera, size } = state
    const angle = Math.atan2(camera.position.x - LOOK.x, camera.position.z - LOOK.z)
    const center = box.getCenter(PROJECTED)
    const cx = center.x, cz = center.z
    const halfX = (box.max.x - box.min.x) / 2
    const halfZ = (box.max.z - box.min.z) / 2
    const height = box.max.y - box.min.y

    CALLOUTS.forEach((callout, i) => {
      const node = nodesRef.current[i]
      if (!node?.el) return
      const show = done && callout.when(angle)
      if (node.shown !== show) {
        node.shown = show
        node.el.style.opacity = show ? '1' : '0'
      }
      if (!show) return
      const [fx, fy, fz] = callout.at
      PROJECTED.set(
        LOOK.x + (cx + fx * halfX) * CAR_SCALE,
        LOOK.y + (box.min.y + fy * height) * CAR_SCALE,
        LOOK.z + (cz + fz * halfZ) * CAR_SCALE,
      ).project(camera)
      const x = (PROJECTED.x * 0.5 + 0.5) * size.width
      const y = (-PROJECTED.y * 0.5 + 0.5) * size.height
      node.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
      // Near the right edge, run the leader line and label out to the left.
      const side = x > size.width * 0.72 ? 'left' : 'right'
      if (node.side !== side) {
        node.side = side
        node.el.dataset.side = side
      }
    })
  })
  return null
}

function Scene({ pointer, staticMode, plotRef, nodesRef }) {
  return (
    <>
      <fog attach="fog" args={['#101820', 12, 22]} />
      <MovingGrid active={!staticMode} />
      <MeasurementGuides />
      <Suspense fallback={null}>
        <group position={LOOK.toArray()} scale={CAR_SCALE}>
          <CarModel staticMode={staticMode} plotRef={plotRef} />
          <Pen plotRef={plotRef} />
          <Scan active={!staticMode} plotRef={plotRef} />
        </group>
        <CalloutTracker plotRef={plotRef} nodesRef={nodesRef} />
      </Suspense>
      <Rig pointer={pointer} staticMode={staticMode} />
    </>
  )
}

function Callout({ callout, register }) {
  return (
    <div
      ref={register}
      data-side="right"
      className="callout absolute left-0 top-0 opacity-0 transition-opacity duration-500"
    >
      <span className="absolute -left-1 -top-1 size-2 rounded-full bg-accent ring-4 ring-accent/25" />
      <svg className="callout-leader absolute left-0 top-0 overflow-visible" width="1" height="1" aria-hidden="true">
        <polyline points="0,0 34,-34 70,-34" fill="none" stroke="#9fbeca" strokeOpacity="0.95" strokeWidth="1.25" />
      </svg>
      <div className="callout-label absolute -top-[64px] whitespace-nowrap bg-ink/75 px-2 py-1.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{callout.title}</p>
        <p className="mt-1 text-xs text-paper-dim">{callout.detail}</p>
      </div>
    </div>
  )
}

export default function BlueprintCar() {
  const staticMode = useMediaQuery('(prefers-reduced-motion: reduce)')
  const pointer = useRef({ x: 0, y: 0 })
  const plotRef = useRef(null)
  const nodesRef = useRef([])

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
        camera={{ position: [4.2, 1.2, 6.4], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        frameloop={staticMode ? 'demand' : 'always'}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x101820, 1)
          gl.localClippingEnabled = true
          camera.lookAt(LOOK)
        }}
      >
        <Scene pointer={pointer} staticMode={staticMode} plotRef={plotRef} nodesRef={nodesRef} />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(16,24,32,0.72)_0%,transparent_58%)]" />
      <div aria-hidden="true">
        {CALLOUTS.map((callout, i) => (
          <Callout
            key={callout.id}
            callout={callout}
            register={(el) => { nodesRef.current[i] = el ? { el, shown: false, side: 'right' } : null }}
          />
        ))}
      </div>
    </div>
  )
}
