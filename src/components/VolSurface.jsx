import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SEGMENTS = 56
const SIZE = 4.4
const RIDGE_STEP = 3

function impliedVol(k, tau, t) {
  const m = k - 1
  const short = 1 / (tau + 0.07)
  const atm = 0.1 + 0.07 * tau
  const smile = (0.22 + 1.15 * short) * m * m
  const skew = -0.42 * short * m
  const pulse = 0.12 * Math.sin(t * 1.35 + k * 4.5) * (0.4 + short * 0.3)
  return Math.max(0.05, atm + smile + skew + pulse)
}

function Mesh({ progressRef }) {
  const group = useRef()
  const color = useMemo(() => new THREE.Color(), [])

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS)
    geo.rotateX(-Math.PI / 2)
    const count = geo.attributes.position.count
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    return geo
  }, [])

  const ridgeGeo = useMemo(() => {
    const ridgeCount = Math.floor(SEGMENTS / RIDGE_STEP) + 1
    const vertsPerRidge = SEGMENTS + 1
    const geo = new THREE.BufferGeometry()
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(ridgeCount * vertsPerRidge * 3), 3),
    )
    const index = []
    for (let r = 0; r < ridgeCount; r++) {
      const base = r * vertsPerRidge
      for (let c = 0; c < SEGMENTS; c++) {
        index.push(base + c, base + c + 1)
      }
    }
    geo.setIndex(index)
    return geo
  }, [])

  useEffect(() => () => {
    geometry.dispose()
    ridgeGeo.dispose()
  }, [geometry, ridgeGeo])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const build = progressRef.current?.value ?? 0
    const pos = geometry.attributes.position
    const col = geometry.attributes.color
    const rPos = ridgeGeo.attributes.position
    let ridgeI = 0

    for (let i = 0; i < pos.count; i++) {
      const row = Math.floor(i / (SEGMENTS + 1))
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const u = x / SIZE + 0.5
      const v = z / SIZE + 0.5
      const k = 0.45 + u * 1.1
      const tau = 0.04 + v * 1.6
      const vol = impliedVol(k, tau, t)

      const dist = Math.hypot(u - 0.5, v - 0.5) * 1.35
      const reveal = THREE.MathUtils.smoothstep(build * 1.45 - dist, 0, 0.18)
      const y = (vol - 0.08) * 14 * reveal

      pos.setY(i, y)

      const h = THREE.MathUtils.clamp(vol, 0.08, 0.85)
      color.setHSL(0.8 - h * 0.62, 0.72, 0.28 + h * 0.38)
      col.setXYZ(i, color.r * reveal, color.g * reveal, color.b * reveal)

      if (row % RIDGE_STEP === 0) {
        rPos.setXYZ(ridgeI, x, y + 0.04, z)
        ridgeI++
      }
    }

    pos.needsUpdate = true
    col.needsUpdate = true
    rPos.needsUpdate = true
    geometry.computeVertexNormals()

    if (!group.current) return
    group.current.rotation.y = -0.55 + t * 0.22
    group.current.rotation.x = 0.18 + Math.sin(t * 0.4) * 0.08

    state.camera.lookAt(0, 0.85, 0)
  })

  return (
    <group ref={group} position={[0, -0.35, 0]}>
      <mesh geometry={geometry}>
        <meshPhongMaterial
          vertexColors
          side={THREE.DoubleSide}
          shininess={90}
          specular="#c4b5fd"
          transparent
          opacity={0.96}
        />
      </mesh>
      <lineSegments geometry={ridgeGeo}>
        <lineBasicMaterial color="#ede9fe" transparent opacity={0.55} />
      </lineSegments>
    </group>
  )
}

export default function VolSurface({ progressRef }) {
  return (
    <Canvas
      camera={{ position: [5.2, 2.1, 4.4], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.75]}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={0.28} />
      <directionalLight position={[4, 6, 2]} intensity={1.55} />
      <directionalLight position={[-3, 1.2, -2]} intensity={0.55} color="#7c3aed" />
      <Mesh progressRef={progressRef} />
    </Canvas>
  )
}
