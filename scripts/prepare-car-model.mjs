// Shrinks a Sketchfab car GLB for the hero's blueprint view. No dependencies.
//
//   node scripts/prepare-car-model.mjs <input.glb> <output.glb> [--keep-dupes] [--no-normals]
//
// - Bakes the root transform (Sketchfab exports Z-up) and turns the car so its
//   long axis runs along Z with the nose at +Z, centred on X/Z, floor at y = 0.
// - Drops textures, UVs and tangents: the hero only needs shape + flat colour.
// - Drops meshes that duplicate another mesh exactly (e.g. clear-coat shells).
// - --no-normals drops normals too (fine for unlit wireframe/flat-fill rendering).
// - Quantises geometry (KHR_mesh_quantization, supported by three's GLTFLoader):
//   positions -> int16, normals -> int8, indices -> uint16 where possible.
import { readFile, writeFile } from 'node:fs/promises'

const [input, output, ...flags] = process.argv.slice(2)
if (!input || !output) {
  console.error('usage: node scripts/prepare-car-model.mjs <input.glb> <output.glb> [--keep-dupes] [--no-normals]')
  process.exit(1)
}
const keepDupes = flags.includes('--keep-dupes')
const dropNormals = flags.includes('--no-normals')

// ---------- read GLB ----------
const file = await readFile(input)
if (file.toString('latin1', 0, 4) !== 'glTF') throw new Error('not a GLB file')
const jsonLength = file.readUInt32LE(12)
const gltf = JSON.parse(file.toString('utf8', 20, 20 + jsonLength))
const binStart = 20 + jsonLength + 8
const bin = file.subarray(binStart, binStart + file.readUInt32LE(20 + jsonLength))

const COMPONENTS = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }
const READERS = {
  5120: [1, 'readInt8'], 5121: [1, 'readUInt8'], 5122: [2, 'readInt16LE'],
  5123: [2, 'readUInt16LE'], 5125: [4, 'readUInt32LE'], 5126: [4, 'readFloatLE'],
}

function readAccessor(index) {
  const acc = gltf.accessors[index]
  const view = gltf.bufferViews[acc.bufferView]
  const n = COMPONENTS[acc.type]
  const [size, method] = READERS[acc.componentType]
  const stride = view.byteStride || size * n
  const base = (view.byteOffset || 0) + (acc.byteOffset || 0)
  const out = new Float64Array(acc.count * n)
  for (let i = 0; i < acc.count; i++) {
    for (let c = 0; c < n; c++) out[i * n + c] = bin[method](base + i * stride + c * size)
  }
  return out
}

// ---------- world transform of each mesh node ----------
const multiply = (a, b) => {
  const r = new Array(16).fill(0)
  for (let col = 0; col < 4; col++) for (let row = 0; row < 4; row++) for (let k = 0; k < 4; k++) r[col * 4 + row] += a[k * 4 + row] * b[col * 4 + k]
  return r
}
function localMatrix(node) {
  if (node.matrix) return node.matrix
  const [x, y, z, w] = node.rotation || [0, 0, 0, 1]
  const [sx, sy, sz] = node.scale || [1, 1, 1]
  const [tx, ty, tz] = node.translation || [0, 0, 0]
  return [
    (1 - 2 * (y * y + z * z)) * sx, 2 * (x * y + z * w) * sx, 2 * (x * z - y * w) * sx, 0,
    2 * (x * y - z * w) * sy, (1 - 2 * (x * x + z * z)) * sy, 2 * (y * z + x * w) * sy, 0,
    2 * (x * z + y * w) * sz, 2 * (y * z - x * w) * sz, (1 - 2 * (x * x + y * y)) * sz, 0,
    tx, ty, tz, 1,
  ]
}
const meshInstances = [] // { mesh, matrix }
function walk(index, parent) {
  const node = gltf.nodes[index]
  const world = multiply(parent, localMatrix(node))
  if (node.mesh !== undefined) meshInstances.push({ mesh: node.mesh, matrix: world })
  for (const child of node.children || []) walk(child, world)
}
const IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
for (const root of gltf.scenes[gltf.scene || 0].nodes) walk(root, IDENTITY)

const apply = (m, x, y, z, w) => [
  m[0] * x + m[4] * y + m[8] * z + m[12] * w,
  m[1] * x + m[5] * y + m[9] * z + m[13] * w,
  m[2] * x + m[6] * y + m[10] * z + m[14] * w,
]

// ---------- collect primitives in world space ----------
const prims = []
const seen = new Set()
let dropped = 0
for (const { mesh, matrix } of meshInstances) {
  for (const p of gltf.meshes[mesh].primitives) {
    const posAcc = gltf.accessors[p.attributes.POSITION]
    const key = `${posAcc.count}|${posAcc.min}|${posAcc.max}|${gltf.accessors[p.indices]?.count}`
    if (!keepDupes && seen.has(key)) { dropped++; continue }
    seen.add(key)
    const pos = readAccessor(p.attributes.POSITION)
    const nrm = !dropNormals && p.attributes.NORMAL !== undefined ? readAccessor(p.attributes.NORMAL) : null
    const idx = p.indices !== undefined ? readAccessor(p.indices) : Float64Array.from({ length: posAcc.count }, (_, i) => i)
    for (let i = 0; i < pos.length; i += 3) {
      const v = apply(matrix, pos[i], pos[i + 1], pos[i + 2], 1)
      pos[i] = v[0]; pos[i + 1] = v[1]; pos[i + 2] = v[2]
      if (nrm) {
        const n = apply(matrix, nrm[i], nrm[i + 1], nrm[i + 2], 0)
        const len = Math.hypot(...n) || 1
        nrm[i] = n[0] / len; nrm[i + 1] = n[1] / len; nrm[i + 2] = n[2] / len
      }
    }
    prims.push({ pos, nrm, idx, material: p.material, name: gltf.meshes[mesh].name })
  }
}

// ---------- align the long axis with +Z (PCA on the ground plane) ----------
let mx = 0, mz = 0, count = 0
for (const { pos } of prims) for (let i = 0; i < pos.length; i += 3) { mx += pos[i]; mz += pos[i + 2]; count++ }
mx /= count; mz /= count
let sxx = 0, szz = 0, sxz = 0
for (const { pos } of prims) for (let i = 0; i < pos.length; i += 3) {
  const dx = pos[i] - mx, dz = pos[i + 2] - mz
  sxx += dx * dx; szz += dz * dz; sxz += dx * dz
}
const major = 0.5 * Math.atan2(2 * sxz, sxx - szz) // angle of the major axis from +X
const turn = major - Math.PI / 2 // rotating by this about Y moves the major axis onto +Z
const cos = Math.cos(turn), sin = Math.sin(turn)
const rotate = (arr, i) => {
  const x = arr[i], z = arr[i + 2]
  arr[i] = x * cos + z * sin
  arr[i + 2] = -x * sin + z * cos
}
const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]
for (const p of prims) {
  for (let i = 0; i < p.pos.length; i += 3) {
    rotate(p.pos, i)
    if (p.nrm) rotate(p.nrm, i)
    for (let c = 0; c < 3; c++) { min[c] = Math.min(min[c], p.pos[i + c]); max[c] = Math.max(max[c], p.pos[i + c]) }
  }
}

// Point the nose at +Z. The highest geometry is assumed to be at the rear (a
// rear wing, or the roof's trailing slope); if it sits on the +Z half, turn
// the car round 180°.
const top = max[1] - 0.06 * (max[1] - min[1])
let topZ = 0, topCount = 0
for (const { pos } of prims) for (let i = 0; i < pos.length; i += 3) if (pos[i + 1] >= top) { topZ += pos[i + 2]; topCount++ }
const midZ = (min[2] + max[2]) / 2
const flipped = topCount > 0 && topZ / topCount > midZ
if (flipped) {
  for (const p of prims) {
    for (let i = 0; i < p.pos.length; i += 3) {
      p.pos[i] = -p.pos[i]; p.pos[i + 2] = -p.pos[i + 2]
      if (p.nrm) { p.nrm[i] = -p.nrm[i]; p.nrm[i + 2] = -p.nrm[i + 2] }
    }
  }
  ;[min[0], max[0]] = [-max[0], -min[0]]
  ;[min[2], max[2]] = [-max[2], -min[2]]
}

// Centre on X/Z, floor at y = 0; one uniform scale keeps normals valid.
const offset = [(min[0] + max[0]) / 2, min[1], (min[2] + max[2]) / 2]
const half = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2]) / 2
const nodeTranslation = [0, 0, 0]
const quant = (v, c) => Math.max(-32767, Math.min(32767, Math.round(((v - offset[c]) / half) * 32767)))

// ---------- write quantised GLB ----------
const chunks = []
let byteLength = 0
const views = []
const accessors = []
function addView(buffer, target, byteStride) {
  const pad = (4 - (byteLength % 4)) % 4
  if (pad) { chunks.push(Buffer.alloc(pad)); byteLength += pad }
  views.push({ buffer: 0, byteOffset: byteLength, byteLength: buffer.length, target, ...(byteStride ? { byteStride } : {}) })
  chunks.push(buffer)
  byteLength += buffer.length
  return views.length - 1
}

const materials = (gltf.materials || []).map((m) => {
  const pbr = m.pbrMetallicRoughness || {}
  return {
    name: m.name,
    pbrMetallicRoughness: {
      baseColorFactor: pbr.baseColorFactor || [0.8, 0.8, 0.8, 1],
      metallicFactor: pbr.metallicFactor ?? 0.4,
      roughnessFactor: pbr.roughnessFactor ?? 0.5,
    },
    ...(m.alphaMode ? { alphaMode: m.alphaMode } : {}),
    doubleSided: true,
  }
})

const meshes = []
let triangles = 0
for (const p of prims) {
  const vertices = p.pos.length / 3
  const posBuf = Buffer.alloc(vertices * 8)
  const pmin = [32767, 32767, 32767], pmax = [-32767, -32767, -32767]
  for (let v = 0; v < vertices; v++) {
    for (let c = 0; c < 3; c++) {
      const q = quant(p.pos[v * 3 + c], c)
      posBuf.writeInt16LE(q, v * 8 + c * 2)
      pmin[c] = Math.min(pmin[c], q); pmax[c] = Math.max(pmax[c], q)
    }
  }
  const attributes = {}
  accessors.push({ bufferView: addView(posBuf, 34962, 8), componentType: 5122, normalized: true, count: vertices, type: 'VEC3', min: pmin, max: pmax })
  attributes.POSITION = accessors.length - 1
  if (p.nrm) {
    const nBuf = Buffer.alloc(vertices * 4)
    for (let v = 0; v < vertices; v++) for (let c = 0; c < 3; c++) nBuf.writeInt8(Math.round(p.nrm[v * 3 + c] * 127), v * 4 + c)
    accessors.push({ bufferView: addView(nBuf, 34962, 4), componentType: 5120, normalized: true, count: vertices, type: 'VEC3' })
    attributes.NORMAL = accessors.length - 1
  }
  const small = vertices <= 65535
  const iBuf = Buffer.alloc(p.idx.length * (small ? 2 : 4))
  p.idx.forEach((value, i) => (small ? iBuf.writeUInt16LE(value, i * 2) : iBuf.writeUInt32LE(value, i * 4)))
  accessors.push({ bufferView: addView(iBuf, 34963), componentType: small ? 5123 : 5125, count: p.idx.length, type: 'SCALAR' })
  triangles += p.idx.length / 3
  meshes.push({ name: p.name, primitives: [{ attributes, indices: accessors.length - 1, ...(p.material !== undefined ? { material: p.material } : {}) }] })
}

const out = {
  asset: { version: '2.0', generator: 'scripts/prepare-car-model.mjs', extras: gltf.asset?.extras },
  extensionsUsed: ['KHR_mesh_quantization'],
  extensionsRequired: ['KHR_mesh_quantization'],
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [
    // Dequantise: positions are in [-1, 1]; scale back to model units.
    { name: 'car', translation: nodeTranslation, scale: [half, half, half], children: meshes.map((_, i) => i + 1) },
    ...meshes.map((m, i) => ({ name: m.name, mesh: i })),
  ],
  meshes,
  materials,
  accessors,
  bufferViews: views,
  buffers: [{ byteLength }],
}

const binChunk = Buffer.concat(chunks, byteLength)
const binPadded = Buffer.concat([binChunk, Buffer.alloc((4 - (byteLength % 4)) % 4)])
let json = Buffer.from(JSON.stringify(out))
json = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)])
const header = Buffer.alloc(12)
header.write('glTF', 0, 'latin1'); header.writeUInt32LE(2, 4)
header.writeUInt32LE(12 + 8 + json.length + 8 + binPadded.length, 8)
const chunkHeader = (len, type) => { const b = Buffer.alloc(8); b.writeUInt32LE(len, 0); b.write(type, 4, 'latin1'); return b }
await writeFile(output, Buffer.concat([header, chunkHeader(json.length, 'JSON'), json, chunkHeader(binPadded.length, 'BIN\0'), binPadded]))

const size = (max.map((v, c) => v - min[c]))
console.log(`meshes ${meshes.length} (dropped ${dropped} duplicates), triangles ${triangles}`)
console.log(`size x/y/z ${size.map((v) => v.toFixed(2)).join(' / ')} (z = length), turned ${(turn * 180 / Math.PI).toFixed(1)}°${flipped ? ' + 180° (nose to +Z)' : ''}`)
console.log(`${input} ${(file.length / 1e6).toFixed(1)} MB -> ${output} ${((12 + 16 + json.length + binPadded.length) / 1e6).toFixed(1)} MB`)
