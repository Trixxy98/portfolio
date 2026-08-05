import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')

// Matches the viewBox of public/favicon.svg — used to pick a render density
// that rasterises the vector at its true target size instead of upscaling.
const SVG_VIEWBOX = 64

const PNG_ICONS = [
  { file: 'favicon-96.png', size: 96 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
]

const ICO_SIZES = [16, 32, 48]

const OG = {
  file: 'og-image.png',
  width: 1200,
  height: 630,
  name: 'Harith Fakrullah',
  role: 'Software Developer',
  url: 'harithfakrullah.dev',
}

async function renderPng(svg, size) {
  const density = Math.ceil((size / SVG_VIEWBOX) * 72)
  return sharp(svg, { density })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/**
 * Packs PNG buffers into a single .ico. Modern ICO files may embed PNG data
 * directly, so each entry is just a header pointing at the raw PNG bytes.
 */
function buildIco(pngs) {
  const HEADER = 6
  const ENTRY = 16

  const header = Buffer.alloc(HEADER)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(pngs.length, 4)

  let offset = HEADER + ENTRY * pngs.length

  const entries = pngs.map(({ size, data }) => {
    const entry = Buffer.alloc(ENTRY)
    entry.writeUInt8(size >= 256 ? 0 : size, 0)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt8(0, 2) // palette colours
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)])
}

function ogSvg(mark) {
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}">
  <rect width="${OG.width}" height="${OG.height}" fill="#0b0b0b"/>
  <rect x="0" y="0" width="${OG.width}" height="6" fill="#7C3AED"/>
  ${mark}
  <text x="90" y="330" fill="#ffffff" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="82" font-weight="600">${OG.name}</text>
  <text x="90" y="400" fill="#A78BFA" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="40" font-weight="400">${OG.role}</text>
  <text x="90" y="530" fill="#737373" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" font-weight="400">${OG.url}</text>
</svg>`)
}

async function main() {
  const svg = await readFile(join(publicDir, 'favicon.svg'))

  for (const { file, size } of PNG_ICONS) {
    await writeFile(join(publicDir, file), await renderPng(svg, size))
    console.log(`✓ ${file} (${size}×${size})`)
  }

  const icoPngs = []
  for (const size of ICO_SIZES) {
    icoPngs.push({ size, data: await renderPng(svg, size) })
  }
  await writeFile(join(publicDir, 'favicon.ico'), buildIco(icoPngs))
  console.log(`✓ favicon.ico (${ICO_SIZES.join(', ')})`)

  // Re-embed the mark in the OG card so it stays in sync with favicon.svg.
  const mark = svg
    .toString()
    .replace(/<\?xml[^>]*\?>/, '')
    .replace(/<svg[^>]*>/, '<svg x="90" y="90" width="96" height="96" viewBox="0 0 64 64">')

  await sharp(ogSvg(mark)).png({ compressionLevel: 9 }).toFile(join(publicDir, OG.file))
  console.log(`✓ ${OG.file} (${OG.width}×${OG.height})`)
}

main()
