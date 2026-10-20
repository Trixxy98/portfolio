import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three'

const LOOK = new THREE.Vector3(0.2, -0.08, 0)
const LINE = '#d7f3ff'
const FILL = '#071828'

function labelFor(angle) {
  const a = Math.abs(angle)
  if (a < 0.85) return 'AERODYNAMICS'
  if (a < 2.25) return 'SUSPENSION'
  return 'POWER UNIT'
}

function useStaticMode() {
  const [staticMode, setStaticMode] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)')
    const apply = () => setStaticMode(query.matches)
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])
  return staticMode
}

function hologram(root) {
  const box = new THREE.Box3().setFromObject(root)
  const center = box.getCenter(new THREE.Vector3())
  root.position.sub(center)
  root.traverse((obj) => {
    if (!obj.isMesh) return
    obj.material = new THREE.MeshBasicMaterial({
      color: FILL,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    })
    const edges = new THREE.EdgesGeometry(obj.geometry, 26)
    obj.add(new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: LINE, transparent: true, opacity: 1 }),
    ))
  })
  return root
}

function CarModel() {
  const gltf = useLoader(GLTFLoader, '/models/race-car.glb')
  const model = useMemo(() => hologram(gltf.scene.clone(true)), [gltf])
  return <primitive object={model} />
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
        opacity={0.14}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function Rig({ pointer, staticMode, onLabel }) {
  const announced = useRef('')

  useFrame((state) => {
    const target = LOOK
    if (staticMode) {
      state.camera.position.set(target.x + 3.1, target.y + 1.25, target.z + 5.4)
      state.camera.lookAt(target)
      return
    }
    const t = state.clock.elapsedTime * 0.18
    const radius = 6.4
    const sway = pointer.current.x * 0.35
    const lift = pointer.current.y * -0.2
    state.camera.position.set(
      target.x + Math.sin(t) * radius + sway,
      target.y + 1.35 + Math.sin(t * 0.6) * 0.28 + lift,
      target.z + Math.cos(t) * radius,
    )
    state.camera.lookAt(target)
    const angle = Math.atan2(state.camera.position.x - target.x, state.camera.position.z - target.z)
    const next = labelFor(angle)
    if (next !== announced.current) {
      announced.current = next
      onLabel(next)
    }
  })

  return null
}

function Scene({ pointer, staticMode, onLabel }) {
  return (
    <>
      <fog attach="fog" args={['#061018', 12, 22]} />
      <gridHelper args={[22, 28, '#143044', '#0c1c28']} position={[LOOK.x, -0.62, 0]} />
      <Suspense fallback={null}>
        <group position={LOOK.toArray()} scale={0.72}>
          <CarModel />
          <Scan active={!staticMode} />
        </group>
      </Suspense>
      <Rig pointer={pointer} staticMode={staticMode} onLabel={onLabel} />
    </>
  )
}

export default function BlueprintCar() {
  const staticMode = useStaticMode()
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
        camera={{ position: [4.2, 1.2, 6.4], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        dpr={staticMode ? 1 : [1, 1.5]}
        frameloop={staticMode ? 'demand' : 'always'}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x061018, 1)
          camera.lookAt(LOOK)
        }}
      >
        <Scene pointer={pointer} staticMode={staticMode} onLabel={setLabel} />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(6,16,24,0.78)_0%,transparent_52%)]" />
      <p className="absolute top-28 right-8 font-mono text-[10px] tracking-[0.28em] text-[#9fd6ff]/75">
        {label}
      </p>
    </div>
  )
}
