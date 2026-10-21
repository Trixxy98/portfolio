import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

extend({ RoundedBoxGeometry })

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

function Screens() {
  const source = useLoader(THREE.TextureLoader, '/wallpapers/dark-macbook.webp')
  const display = useMemo(() => {
    const texture = source.clone()
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    texture.needsUpdate = true
    return texture
  }, [source])

  useEffect(() => () => display.dispose(), [display])

  return (
    <>
      {/* Pro Display XDR, raised behind the MacBook like the reference setup. */}
      <group position={[0.7, 0.12, -1.14]}>
        <mesh castShadow position={[0, 0.04, -0.09]}>
          <roundedBoxGeometry args={[0.14, 0.72, 0.18, 4, 0.025]} />
          <meshStandardMaterial color="#aab0b7" metalness={0.8} roughness={0.28} />
        </mesh>
        <mesh castShadow position={[0, -0.29, 0.06]}>
          <roundedBoxGeometry args={[0.87, 0.045, 0.48, 4, 0.017]} />
          <meshStandardMaterial color="#aab0b7" metalness={0.8} roughness={0.28} />
        </mesh>
        <mesh castShadow position={[0, 1.11, 0]}>
          <roundedBoxGeometry args={[3.62, 2.12, 0.09, 4, 0.024]} />
          <meshStandardMaterial color="#b4bac1" metalness={0.75} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.11, 0.052]}>
          <roundedBoxGeometry args={[3.55, 2.05, 0.009, 4, 0.018]} />
          <meshStandardMaterial color="#050709" roughness={0.18} />
        </mesh>
        <mesh position={[0, 1.11, 0.06]}>
          <planeGeometry args={[3.46, 1.96]} />
          <meshBasicMaterial map={display} toneMapped={false} />
        </mesh>
        <mesh position={[0, 2.215, 0.055]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 3.15, 20]} />
          <meshStandardMaterial color="#23272c" metalness={0.3} roughness={0.45} />
        </mesh>
        <mesh position={[0, 2.14, 0.1]}>
          <boxGeometry args={[0.2, 0.1, 0.13]} />
          <meshStandardMaterial color="#11161b" />
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
        {Array.from({ length: 5 }, (_, row) =>
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
            <meshBasicMaterial map={display} toneMapped={false} />
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

function Setup() {
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
    const radius = Math.max(7.6, 9.1 - (size.width / size.height - 0.9) * 2)
    const angle = 0.38 + Math.sin(clock.elapsedTime * 0.28) * 0.25
    camera.position.set(
      Math.sin(angle) * radius,
      3.05 + Math.sin(clock.elapsedTime * 0.2) * 0.12,
      Math.cos(angle) * radius,
    )
    camera.lookAt(0, 0.24, 0)
  })

  return (
    <>
      <ambientLight intensity={0.9} />
      <hemisphereLight args={['#dce8f4', '#343440', 2]} />
      <directionalLight
        position={[-3, 6, 4]}
        intensity={3}
        color="#fff6eb"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.001}
      />
      <pointLight position={[3, 2, -2]} intensity={8} color="#9dc8ff" distance={8} />

      <mesh receiveShadow position={[0, -0.52, 0]}>
        <roundedBoxGeometry args={[6.6, 0.16, 3.3, 4, 0.025]} />
        <meshStandardMaterial map={marble} roughness={0.5} metalness={0.08} />
      </mesh>
      {[-2.87, 2.87].map((x) =>
        [-1.27, 1.27].map((z) => (
          <mesh key={`${x}-${z}`} castShadow position={[x, -1.23, z]}>
            <roundedBoxGeometry args={[0.14, 1.26, 0.14, 3, 0.015]} />
            <meshStandardMaterial color="#373c41" metalness={0.45} roughness={0.52} />
          </mesh>
        )),
      )}
      <mesh receiveShadow position={[-0.3, -0.425, 0.5]}>
        <roundedBoxGeometry args={[4.9, 0.025, 2.05, 4, 0.07]} />
        <meshStandardMaterial color="#abb0b3" roughness={0.85} metalness={0.02} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.72, -0.28, -1.05]}>
        <roundedBoxGeometry args={[4.05, 0.15, 0.95, 4, 0.018]} />
        <meshStandardMaterial map={wood} roughness={0.6} />
      </mesh>
      <Screens />
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
    </>
  )
}

function MobileWorkspace() {
  return (
    <svg viewBox="0 0 440 300" role="img" aria-label="MacBook Pro connected to a Pro Display XDR on a desk" className="mx-auto w-full max-w-[440px]">
      <defs>
        <linearGradient id="workspace-silver" x2="1" y2="1">
          <stop stopColor="#d5e2e8" />
          <stop offset="1" stopColor="#8096a4" />
        </linearGradient>
      </defs>
      <path d="M31 233h378l18 17H12z" fill="#25282c" stroke="#50545b" strokeWidth="2" />
      <path d="M47 233h330l-18 10H64z" fill="#a8abae" />
      <path d="M37 251v43m366-43v43" stroke="#42484e" strokeWidth="6" />
      <path d="M141 184h235v11H141z" fill="#70533e" />
      <rect x="145" y="28" width="225" height="147" rx="6" fill="url(#workspace-silver)" />
      <image href="/wallpapers/dark-macbook.webp" x="152" y="35" width="211" height="133" preserveAspectRatio="xMidYMid slice" />
      <path d="M157 21h201" stroke="#25282c" strokeWidth="10" strokeLinecap="round" />
      <path d="M253 175v13m-28 7h56" stroke="url(#workspace-silver)" strokeWidth="7" strokeLinecap="round" />
      <path d="M192 220c-19-20-53 0-72 0" stroke="#383e45" strokeWidth="2" fill="none" />
      <path d="M61 127h136v92H61z" fill="url(#workspace-silver)" />
      <image href="/wallpapers/dark-macbook.webp" x="66" y="132" width="126" height="82" preserveAspectRatio="xMidYMid slice" />
      <path d="M60 220h140l15 13H45z" fill="url(#workspace-silver)" />
      <path d="M79 224h104" stroke="#2b3138" strokeWidth="3" />
      <rect x="291" y="214" width="51" height="19" rx="3" fill="url(#workspace-silver)" />
      <rect x="293" y="214" width="47" height="15" rx="2" fill="#d3d8db" />
    </svg>
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
    <div ref={visualRef} className="relative h-[240px] overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(32,39,50,0.48),transparent_72%)] md:h-[340px] lg:h-[380px]">
      {isDesktop ? (
        hasEntered && <Canvas
          camera={{ position: [3.3, 3.05, 8.4], fov: 43 }}
          dpr={[1, 1.5]}
          frameloop={inView ? 'always' : 'demand'}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          shadows
          onCreated={({ camera }) => camera.lookAt(0, 0.24, 0)}
        >
          <Suspense fallback={null}>
            <Setup />
          </Suspense>
        </Canvas>
      ) : (
        <div className="flex h-full items-center justify-center">
          <MobileWorkspace />
        </div>
      )}
    </div>
  )
}
