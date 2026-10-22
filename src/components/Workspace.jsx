import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

extend({ RoundedBoxGeometry })

const floorTiles = Array.from({ length: 9 * 9 }, (_, index) => {
  const x = index % 9
  const z = Math.floor(index / 9)
  return { position: [-4 + x, -1.87, -2.5 + z], color: (x + z) % 2 ? '#e5e2dd' : '#f5f3ef' }
})

function BlockTiles({ tiles, size }) {
  const ref = useRef(null)
  const block = useMemo(() => new THREE.Object3D(), [])

  useLayoutEffect(() => {
    tiles.forEach(({ position, color }, index) => {
      block.position.set(...position)
      block.updateMatrix()
      ref.current.setMatrixAt(index, block.matrix)
      ref.current.setColorAt(index, new THREE.Color(color))
    })
    ref.current.instanceMatrix.needsUpdate = true
    ref.current.instanceColor.needsUpdate = true
    ref.current.computeBoundingSphere()
  }, [block, tiles])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, tiles.length]} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#ffffff" roughness={0.85} metalness={0.04} />
    </instancedMesh>
  )
}

function posterTexture(accent, number) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 384
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#111b28'
  ctx.fillRect(0, 0, 256, 384)
  ctx.fillStyle = accent
  ctx.globalAlpha = 0.22
  ctx.beginPath()
  ctx.moveTo(256, 20)
  ctx.lineTo(256, 210)
  ctx.lineTo(0, 375)
  ctx.lineTo(0, 280)
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.font = 'bold 16px sans-serif'
  ctx.fillStyle = '#f1efe9'
  ctx.fillText('FORMULA / 26', 18, 33)
  ctx.font = '11px monospace'
  ctx.fillStyle = '#9db0bb'
  ctx.fillText(`DESIGN STUDY  ${number}`, 18, 51)

  // Top-down single-seater silhouette: wing, tyres, tapered nose and halo.
  ctx.fillStyle = '#080e15'
  for (const y of [132, 283]) {
    ctx.fillRect(34, y, 42, 53)
    ctx.fillRect(180, y, 42, 53)
  }
  ctx.fillStyle = '#a8b6bb'
  ctx.fillRect(36, 100, 184, 6)
  ctx.fillRect(52, 326, 152, 8)
  ctx.fillStyle = accent
  ctx.fillRect(31, 108, 194, 13)
  ctx.fillRect(57, 314, 142, 18)
  ctx.beginPath()
  ctx.moveTo(118, 112)
  ctx.lineTo(138, 112)
  ctx.lineTo(153, 202)
  ctx.lineTo(175, 240)
  ctx.lineTo(163, 306)
  ctx.lineTo(93, 306)
  ctx.lineTo(81, 240)
  ctx.lineTo(103, 202)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#08121e'
  ctx.beginPath()
  ctx.ellipse(128, 210, 22, 32, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#deebef'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(128, 191)
  ctx.lineTo(128, 228)
  ctx.moveTo(108, 202)
  ctx.lineTo(128, 192)
  ctx.lineTo(148, 202)
  ctx.stroke()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(128, 125)
  ctx.lineTo(128, 177)
  ctx.moveTo(101, 245)
  ctx.lineTo(155, 245)
  ctx.stroke()

  ctx.font = 'bold 20px sans-serif'
  ctx.fillText(`GP ${number}`, 18, 366)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function RacingPoster({ x, accent, number }) {
  const texture = useMemo(() => posterTexture(accent, number), [accent, number])
  useEffect(() => () => texture.dispose(), [texture])

  return (
    <group position={[x, 1.72, -2.88]}>
      <mesh castShadow>
        <boxGeometry args={[0.84, 1.24, 0.08]} />
        <meshStandardMaterial color="#272c30" metalness={0.35} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.047]}>
        <planeGeometry args={[0.76, 1.16]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Room() {
  return (
    <group>
      <mesh receiveShadow position={[0, -1.98, 1.5]}>
        <boxGeometry args={[9.2, 0.12, 9.2]} />
        <meshStandardMaterial color="#c6c1bb" roughness={0.9} />
      </mesh>
      <BlockTiles tiles={floorTiles} size={[0.94, 0.035, 0.94]} />

      <mesh receiveShadow position={[0, 1.45, -3.1]}>
        <boxGeometry args={[9.2, 6.75, 0.18]} />
        <meshStandardMaterial color="#dec8b6" roughness={0.95} />
      </mesh>

      <mesh receiveShadow position={[-4.6, 1.45, 1.5]}>
        <boxGeometry args={[0.18, 6.75, 9.2]} />
        <meshStandardMaterial color="#d1bba9" roughness={0.95} />
      </mesh>

      <mesh position={[0, -1.78, -2.9]}>
        <boxGeometry args={[9.2, 0.16, 0.12]} />
        <meshStandardMaterial color="#ece4db" />
      </mesh>
      <mesh position={[-4.4, -1.78, 1.5]}>
        <boxGeometry args={[0.12, 0.16, 9.2]} />
        <meshStandardMaterial color="#e7dcd1" />
      </mesh>

      <RacingPoster x={-3.55} accent="#e76840" number="01" />
      <RacingPoster x={-2.48} accent="#36b9b4" number="02" />
      <RacingPoster x={3.25} accent="#ef9a3d" number="03" />

      {[-4.18, 4.18].map((x) => (
        <group key={x} position={[x, 2.1, -2.93]}>
          <mesh castShadow>
            <roundedBoxGeometry args={[0.2, 0.62, 0.1, 3, 0.025]} />
            <meshStandardMaterial color="#75685f" metalness={0.35} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.057]}>
            <boxGeometry args={[0.12, 0.5, 0.012]} />
            <meshBasicMaterial color="#ffce94" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function surfaceTexture(kind) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = kind === 'wood' ? '#66503b' : '#1b2027'
  ctx.fillRect(0, 0, 512, 512)

  for (let i = 0; i < 90; i += 1) {
    const y = (i * 137) % 512
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.bezierCurveTo(165, y + (i % 5) - 2, 350, y - (i % 7), 512, y + 2)
    ctx.strokeStyle = kind === 'wood'
      ? `rgba(26,15,10,${0.04 + (i % 4) * 0.025})`
      : `rgba(181,194,203,${0.015 + (i % 5) * 0.008})`
    ctx.lineWidth = i % 12 === 0 ? 2 : 0.7
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function Screens({ isMobile }) {
  const monitorSource = useLoader(THREE.TextureLoader, '/wallpapers/xdr-ribbons.webp')
  const monitor = useMemo(() => {
    const texture = monitorSource.clone()
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    texture.needsUpdate = true
    return texture
  }, [monitorSource])

  useEffect(() => () => monitor.dispose(), [monitor])

  return (
    <>
      {/* Black-bezel XDR-style monitor with a visible silver pedestal. */}
      <group position={[0.7, 0.12, -1.14]}>
        <mesh castShadow position={[0, 0.16, -0.09]}>
          <roundedBoxGeometry args={[0.36, 0.88, 0.15, 4, 0.025]} />
          <meshStandardMaterial color="#c6cbd0" metalness={0.65} roughness={0.35} />
        </mesh>
        <mesh castShadow position={[0, -0.18, 0.04]}>
          <roundedBoxGeometry args={[1.06, 0.05, 0.54, 4, 0.02]} />
          <meshStandardMaterial color="#b7bdc3" metalness={0.65} roughness={0.38} />
        </mesh>
        <mesh castShadow position={[0, 1.28, -0.025]}>
          <roundedBoxGeometry args={[3.64, 2.14, 0.095, 4, 0.025]} />
          <meshStandardMaterial color="#b7bdc3" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.28, 0.035]}>
          <roundedBoxGeometry args={[3.6, 2.1, 0.025, 4, 0.025]} />
          <meshStandardMaterial color="#050709" roughness={0.18} />
        </mesh>
        <mesh position={[0, 1.28, 0.051]}>
          <planeGeometry args={[3.43, 1.91]} />
          <meshBasicMaterial map={monitor} toneMapped={false} />
        </mesh>
        <mesh position={[0, 2.29, 0.055]}>
          <sphereGeometry args={[0.016, 8, 8]} />
          <meshBasicMaterial color="#262a31" />
        </mesh>
      </group>

      {/* MacBook Pro — open display, keyboard and trackpad. */}
      <group position={[-1.04, -0.35, 0.83]}>
        <mesh castShadow>
          <roundedBoxGeometry args={[2.05, 0.065, 1.36, 4, 0.028]} />
          <meshStandardMaterial color="#b5bbc3" metalness={0.74} roughness={0.31} />
        </mesh>
        <mesh position={[0, 0.037, -0.16]}>
          <roundedBoxGeometry args={[1.83, 0.005, 0.86, 4, 0.018]} />
          <meshStandardMaterial color="#262a30" roughness={0.68} />
        </mesh>
        {!isMobile && Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 12 }, (_, col) => (
            <mesh key={`${row}-${col}`} position={[-0.82 + col * 0.149, 0.042, -0.49 + row * 0.15]}>
              <roundedBoxGeometry args={[0.125, 0.004, 0.12, 2, 0.01]} />
              <meshStandardMaterial color="#161a20" roughness={0.83} />
            </mesh>
          )),
        )}
        <mesh position={[0, 0.038, 0.49]}>
          <roundedBoxGeometry args={[0.68, 0.003, 0.3, 3, 0.012]} />
          <meshStandardMaterial color="#9ca4ad" metalness={0.65} roughness={0.4} />
        </mesh>
        <group position={[0, 0.055, -0.67]} rotation={[-0.2, 0, 0]}>
          <mesh castShadow position={[0, 0.625, 0]}>
            <roundedBoxGeometry args={[2.05, 1.25, 0.045, 4, 0.025]} />
            <meshStandardMaterial color="#b5bbc3" metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.625, 0.026]}>
            <roundedBoxGeometry args={[1.99, 1.2, 0.006, 4, 0.014]} />
            <meshStandardMaterial color="#050609" roughness={0.18} />
          </mesh>
          <mesh position={[0, 0.625, 0.031]}>
            <planeGeometry args={[1.91, 1.1]} />
            <meshBasicMaterial map={monitor} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </>
  )
}

function MagicTrackpad() {
  return (
    <group position={[1.35, -0.38, 0.92]} rotation={[0.045, -0.2, 0]}>
      <mesh castShadow>
        <roundedBoxGeometry args={[1.02, 0.065, 0.66, 4, 0.025]} />
        <meshStandardMaterial color="#aab3bb" metalness={0.72} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.036, 0]}>
        <roundedBoxGeometry args={[0.99, 0.008, 0.63, 4, 0.018]} />
        <meshStandardMaterial color="#d3d8db" metalness={0.18} roughness={0.46} />
      </mesh>
    </group>
  )
}

function GamingChair() {
  const back = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-0.39, -0.84)
    shape.quadraticCurveTo(-0.54, -0.8, -0.56, -0.55)
    shape.lineTo(-0.59, 0.14)
    shape.quadraticCurveTo(-0.65, 0.36, -0.46, 0.54)
    shape.lineTo(-0.32, 0.69)
    shape.quadraticCurveTo(0, 0.74, 0.32, 0.69)
    shape.lineTo(0.46, 0.54)
    shape.quadraticCurveTo(0.65, 0.36, 0.59, 0.14)
    shape.lineTo(0.56, -0.55)
    shape.quadraticCurveTo(0.54, -0.8, 0.39, -0.84)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.025,
      bevelSegments: 2,
      curveSegments: 6,
    })
  }, [])

  useEffect(() => () => back.dispose(), [back])

  return (
    <group position={[0.45, 0, 1.23]}>
      {/* Black gaming-chair silhouette, facing the desk (-Z). */}
      <group position={[0, 0.18, 0]}>
      <mesh castShadow position={[0, -1.06, 0]} rotation={[-0.04, 0, 0]}>
        <roundedBoxGeometry args={[1.12, 0.16, 0.92, 4, 0.065]} />
        <meshStandardMaterial color="#17191d" roughness={0.78} />
      </mesh>
      <mesh geometry={back} castShadow position={[0, -0.2, 0.36]} rotation={[-0.06, 0, 0]}>
        <meshStandardMaterial color="#121417" roughness={0.78} />
      </mesh>
      <mesh position={[0, -0.21, 0.54]}>
        <roundedBoxGeometry args={[0.78, 1.18, 0.045, 4, 0.055]} />
        <meshStandardMaterial color="#202226" roughness={0.89} />
      </mesh>
      <mesh position={[0, 0.52, 0.5]}>
        <roundedBoxGeometry args={[0.82, 0.25, 0.075, 3, 0.04]} />
        <meshStandardMaterial color="#191b1e" roughness={0.76} />
      </mesh>
      {[-0.54, 0.54].map((x) => (
        <group key={x}>
          <mesh castShadow position={[x, 0.37, 0.46]} rotation={[0, 0, x > 0 ? -0.17 : 0.17]}>
            <roundedBoxGeometry args={[0.22, 0.35, 0.16, 3, 0.065]} />
            <meshStandardMaterial color="#1b1d21" roughness={0.72} />
          </mesh>
          <mesh castShadow position={[x, -0.19, 0.48]} rotation={[0, 0, x > 0 ? -0.06 : 0.06]}>
            <roundedBoxGeometry args={[0.16, 1.32, 0.17, 4, 0.06]} />
            <meshStandardMaterial color="#181a1e" roughness={0.72} />
          </mesh>
          <mesh position={[x * 0.69, -0.17, 0.59]}>
            <boxGeometry args={[0.018, 0.95, 0.01]} />
            <meshBasicMaterial color="#35383d" />
          </mesh>
          <mesh castShadow position={[x * 1.15, -0.78, -0.08]}>
            <roundedBoxGeometry args={[0.18, 0.085, 0.7, 3, 0.035]} />
            <meshStandardMaterial color="#1c1e22" roughness={0.7} />
          </mesh>
          <mesh position={[x * 1.15, -0.95, 0.2]}>
            <boxGeometry args={[0.07, 0.25, 0.07]} />
            <meshStandardMaterial color="#494c50" metalness={0.35} roughness={0.55} />
          </mesh>
        </group>
      ))}
      </group>
      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[0.085, 0.095, 0.77, 12]} />
        <meshStandardMaterial color="#565a5f" metalness={0.45} roughness={0.45} />
      </mesh>
      {Array.from({ length: 5 }, (_, index) => {
        const angle = index * Math.PI * 2 / 5
        return (
          <group key={index} rotation={[0, angle, 0]}>
            <mesh position={[0, -1.68, 0.3]}>
              <roundedBoxGeometry args={[0.11, 0.08, 0.6, 3, 0.03]} />
              <meshStandardMaterial color="#33363a" roughness={0.6} />
            </mesh>
            <mesh position={[0, -1.74, 0.57]}>
              <sphereGeometry args={[0.075, 10, 8]} />
              <meshStandardMaterial color="#161819" roughness={0.78} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function Setup({ isMobile }) {
  const marble = useMemo(() => surfaceTexture('marble'), [])
  const wood = useMemo(() => surfaceTexture('wood'), [])
  const cable = useMemo(() => new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.02, -0.37, 0.78),
      new THREE.Vector3(0.25, -0.4, 0.8),
      new THREE.Vector3(0.6, -0.41, 0.3),
      new THREE.Vector3(0.84, -0.32, -0.52),
      new THREE.Vector3(0.7, -0.2, -0.99),
    ]),
    40, 0.01, 6, false,
  ), [])

  useEffect(() => () => {
    cable.dispose()
    marble.dispose()
    wood.dispose()
  }, [cable, marble, wood])

  useFrame(({ camera, clock, size }) => {
    const radius = isMobile ? 10 : Math.max(7.6, 9.1 - (size.width / size.height - 0.9) * 2)
    const angle = isMobile
      ? 0.3 + Math.sin(clock.elapsedTime * 0.28) * 0.18
      : 0.38 + Math.sin(clock.elapsedTime * 0.28) * 0.25
    camera.position.set(
      Math.sin(angle) * radius,
      2.55 + Math.sin(clock.elapsedTime * 0.2) * 0.12,
      Math.cos(angle) * radius,
    )
    camera.lookAt(0, 0.1, 0)
  })

  return (
    <>
      <ambientLight intensity={0.75} />
      <hemisphereLight args={['#fff0dd', '#8e8990', 1.4]} />
      <directionalLight
        position={[-3, 6, 4]}
        intensity={2.2}
        color="#ffe6c5"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.001}
      />
      <pointLight position={[-3.7, 2.1, -2.45]} intensity={11} color="#ffbe7f" distance={6} />
      <pointLight position={[3.7, 2.1, -2.45]} intensity={9} color="#ffd2a1" distance={6} />
      <pointLight position={[2, 1.5, -1.3]} intensity={2.5} color="#9dc8ff" distance={5} />
      <Room />

      <group position={[0, 0.3, -1.15]} scale={0.85}>
        <mesh receiveShadow position={[0, -0.52, 0]}>
          <roundedBoxGeometry args={[6.6, 0.16, 3.3, 4, 0.025]} />
          <meshStandardMaterial map={marble} roughness={0.5} metalness={0.08} />
        </mesh>
        {[-2.87, 2.87].map((x) =>
          [-1.27, 1.27].map((z) => (
            <group key={`${x}-${z}`} position={[x, -1.565, z]}>
              <mesh castShadow>
                <roundedBoxGeometry args={[0.19, 1.93, 0.19, 3, 0.025]} />
                <meshStandardMaterial color="#373c41" metalness={0.5} roughness={0.46} />
              </mesh>
              <mesh position={[0, -0.96, 0]}>
                <boxGeometry args={[0.22, 0.035, 0.22]} />
                <meshStandardMaterial color="#202428" roughness={0.72} />
              </mesh>
            </group>
          )),
        )}
        {[-1.27, 1.27].map((z) => (
          <mesh key={z} position={[0, -0.7, z]}>
            <boxGeometry args={[5.82, 0.09, 0.09]} />
            <meshStandardMaterial color="#303439" metalness={0.4} roughness={0.5} />
          </mesh>
        ))}
        {[-2.87, 2.87].map((x) => (
          <mesh key={x} position={[x, -0.7, 0]}>
            <boxGeometry args={[0.09, 0.09, 2.54]} />
            <meshStandardMaterial color="#303439" metalness={0.4} roughness={0.5} />
          </mesh>
        ))}
        <mesh receiveShadow position={[-0.3, -0.425, 0.5]}>
          <roundedBoxGeometry args={[4.9, 0.025, 2.05, 4, 0.07]} />
          <meshStandardMaterial color="#abb0b3" roughness={0.85} metalness={0.02} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.72, -0.28, -1.05]}>
          <roundedBoxGeometry args={[4.05, 0.15, 0.95, 4, 0.018]} />
          <meshStandardMaterial map={wood} roughness={0.6} />
        </mesh>
        <Screens isMobile={isMobile} />
        <mesh geometry={cable}>
          <meshStandardMaterial color="#222830" roughness={0.8} />
        </mesh>
        <MagicTrackpad />
        {/* Desktop control dial. */}
        <mesh castShadow position={[2.08, -0.38, -0.2]}>
          <cylinderGeometry args={[0.24, 0.27, 0.1, 32]} />
          <meshStandardMaterial color="#30343a" metalness={0.4} roughness={0.45} />
        </mesh>
        <mesh castShadow position={[2.08, -0.29, -0.2]}>
          <cylinderGeometry args={[0.115, 0.115, 0.14, 32]} />
          <meshStandardMaterial color="#939ca3" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      <GamingChair />
    </>
  )
}

export default function WorkspaceVisual() {
  const visualRef = useRef(null)
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  )
  const [inView, setInView] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const update = () => setIsDesktop(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
      if (entry.isIntersecting) {
        setHasEntered(true)
      }
    }, { rootMargin: '150px' })
    observer.observe(visualRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={visualRef} className="relative h-[280px] overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(32,39,50,0.48),transparent_72%)] sm:h-[320px] md:h-[340px] lg:h-[380px]">
      {hasEntered && <Canvas
        camera={{ position: [3.3, 2.55, isDesktop ? 8.4 : 10], fov: 43 }}
        dpr={[1, 1.5]}
        frameloop={inView ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true, powerPreference: isDesktop ? 'high-performance' : 'low-power' }}
        shadows={isDesktop}
        onCreated={({ camera }) => camera.lookAt(0, 0.1, 0)}
      >
        <Suspense fallback={null}>
          <Setup isMobile={!isDesktop} />
        </Suspense>
      </Canvas>}
    </div>
  )
}
