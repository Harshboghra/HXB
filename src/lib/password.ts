const PBKDF2_ITERATIONS = 150_000
const textEncoder = new TextEncoder()

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index] ?? 0)
  }

  return btoa(binary)
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

async function derivePasswordHash(password: string, saltBytes: Uint8Array): Promise<string> {
  const saltBuffer = saltBytes.buffer.slice(0) as ArrayBuffer
  const baseKey = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    256,
  )

  return arrayBufferToBase64(bits)
}

export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const saltBytes = salt ? base64ToUint8Array(salt) : crypto.getRandomValues(new Uint8Array(16))
  const hash = await derivePasswordHash(password, saltBytes)
  const saltBuffer = saltBytes.buffer.slice(0) as ArrayBuffer

  return {
    hash,
    salt: arrayBufferToBase64(saltBuffer),
  }
}

export async function verifyPassword(password: string, salt: string, expectedHash: string): Promise<boolean> {
  const { hash } = await hashPassword(password, salt)
  return hash === expectedHash
}
