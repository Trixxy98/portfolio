// Convert project screenshots in public/ to resized WebP for the project cards.
import { join, dirname, parse } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const FILES = process.argv.slice(2)

for (const file of FILES) {
  const { name } = parse(file)
  const out = join(publicDir, `${name}.webp`)
  const info = await sharp(join(publicDir, file))
    .resize({ width: 1000, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out)
  console.log(`${file} -> ${name}.webp (${Math.round(info.size / 1024)} KB)`)
}
