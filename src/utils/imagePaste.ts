import { readFile } from 'fs/promises'
import path from 'path'
import { logError } from './log.js'
import type { ImageDimensions } from './imageResizer.js'

export const PASTE_THRESHOLD = 800

const IMAGE_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.bmp',
  '.svg',
  '.tif',
  '.tiff',
  '.heic',
  '.heif',
  '.avif',
  '.ico',
])

export type ClipboardImage = {
  base64: string
  mediaType: string
  dimensions?: ImageDimensions
}

export type FileImage = ClipboardImage & {
  path: string
}

export async function hasImageInClipboard(): Promise<boolean> {
  return false
}

export async function getImageFromClipboard(): Promise<ClipboardImage | null> {
  return null
}

export function isImageFilePath(value: string): boolean {
  const trimmed = value.trim().replace(/^['"]|['"]$/g, '')
  if (!trimmed) return false

  const isAbsolute =
    path.isAbsolute(trimmed) || /^[A-Za-z]:[\\/]/.test(trimmed)

  if (!isAbsolute) {
    return false
  }

  const ext = path.extname(trimmed).toLowerCase()
  return IMAGE_EXTENSIONS.has(ext)
}

export async function tryReadImageFromPath(
  imagePath: string,
): Promise<FileImage | null> {
  const normalizedPath = imagePath.trim().replace(/^['"]|['"]$/g, '')
  if (!isImageFilePath(normalizedPath)) {
    return null
  }

  try {
    const buffer = await readFile(normalizedPath)
    return {
      path: normalizedPath,
      base64: buffer.toString('base64'),
      mediaType: getMediaType(normalizedPath),
    }
  } catch (error) {
    logError(error)
    return null
  }
}

function getMediaType(filePath: string): string {
  switch (path.extname(filePath).toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.gif':
      return 'image/gif'
    case '.webp':
      return 'image/webp'
    case '.bmp':
      return 'image/bmp'
    case '.svg':
      return 'image/svg+xml'
    case '.tif':
    case '.tiff':
      return 'image/tiff'
    case '.heic':
      return 'image/heic'
    case '.heif':
      return 'image/heif'
    case '.avif':
      return 'image/avif'
    case '.ico':
      return 'image/x-icon'
    default:
      return 'image/png'
  }
}
